import { expect, suite, test, vi } from "vitest";
import { Factory, type FactoryContext } from "./factory.js";

class TestFactory extends Factory<{ a: number; b: number }> {
  protected override construct() {
    return { a: 0, b: 0 };
  }
}

suite("Factory.create", () => {
  test("creates a new instance of the implementing factory class", () => {
    const factory = TestFactory.create();

    expect(factory).toBeInstanceOf(TestFactory);
    expect(factory).toBeInstanceOf(Factory);
  });

  test("creates factories with different identifier symbols", () => {
    const factory1 = TestFactory.create();
    const factory2 = TestFactory.create();

    expect(factory1.identifier).not.toBe(factory2.identifier);
  });
});

suite("Factory.prototype.identifier", () => {
  test("returns the identifier symbol of the factory", () => {
    const factory = TestFactory.create();

    expect(factory.identifier).toBeTypeOf("symbol");
  });
});

suite("Factory.prototype.ctx", () => {
  test("provides the build context during data construction", () => {
    class TestFactory extends Factory<{ a: number }> {
      protected override construct() {
        context = this.ctx;
        return { a: 0 };
      }
    }
    let context: FactoryContext<{ a: number }>;
    const factory = TestFactory.create();

    factory.build({ a: 1 });

    expect(context!).toStrictEqual({ sequence: 0, params: { a: 1 } });
  });

  test("throws a TypeError when ctx is used outside of construct", () => {
    class TestFactory extends Factory<{ a: number }> {
      protected override construct() {
        return { a: 0 };
      }
      variant() {
        return this.ctx.params;
      }
    }
    const factory = TestFactory.create();

    const call = () => void factory.variant();

    expect(call).toThrowErrorMatchingInlineSnapshot(
      `[TypeError: FactoryContext can only be accessed in the \`construct\` method.]`,
    );
  });
});

suite("Factory.prototype.createContext", () => {
  test("can be overridden to extend the build context", () => {
    class TestFactory extends Factory<string> {
      protected override createContext(params?: string) {
        return {
          ...super.createContext(params),
          custom: "test value",
        };
      }
      protected override construct() {
        return this.ctx.custom;
      }
    }
    const factory = TestFactory.create();

    const data = factory.build();

    expect(data).toBe("test value");
  });
});

suite("Factory.prototype.reset", () => {
  test("resets the factory sequence", () => {
    class TestFactory extends Factory<number> {
      protected override construct() {
        return this.ctx.sequence;
      }
    }
    const factory = TestFactory.create();

    const seq0 = factory.build();
    const seq1 = factory.build();
    factory.reset();
    const seq2 = factory.build();

    expect(seq0).toBe(0);
    expect(seq1).toBe(1);
    expect(seq2).toBe(0);
  });
});

suite("Factory.prototype.refine", () => {
  test("creates a new factory instance", () => {
    const factory = TestFactory.create();

    const refined = factory.refine({ a: 1 });

    expect(refined).not.toBe(factory);
  });

  test("shares identifier and sequence with the parent factory", () => {
    class TestFactory extends Factory<{ a: number }> {
      protected override construct() {
        return { a: this.ctx.sequence };
      }
    }
    const factory = TestFactory.create();
    const refined = factory.refine({});

    const data1 = refined.build();
    const data2 = factory.build();
    const data3 = refined.build();

    expect(refined.identifier).toBe(factory.identifier);
    expect(data1).toStrictEqual({ a: 0 });
    expect(data2).toStrictEqual({ a: 1 });
    expect(data3).toStrictEqual({ a: 2 });
  });

  test("binds params to the instance and uses them when build() is called", () => {
    const factory = TestFactory.create();

    const data = factory.refine({ a: 1 }).build();

    expect(data).toStrictEqual({ a: 1, b: 0 });
  });

  test("merges params with existing params", () => {
    const factory = TestFactory.create();

    const data = factory.refine({ a: 1 }).refine({ b: 1 }).build();

    expect(data).toStrictEqual({ a: 1, b: 1 });
  });

  test("does not modify existing factory params", () => {
    const factory = TestFactory.create();
    const refined = factory.refine({ a: 1 });

    const dataOriginal = factory.build();
    const dataRefined = refined.build();

    expect(dataOriginal).toStrictEqual({ a: 0, b: 0 });
    expect(dataRefined).toStrictEqual({ a: 1, b: 0 });
  });
});

suite("Factory.prototype.build", () => {
  test("builds data based on the result of construct()", () => {
    const factory = TestFactory.create();

    const data = factory.build();

    expect(data).toStrictEqual({ a: 0, b: 0 });
  });

  test("applies partial data to the result", () => {
    const factory = TestFactory.create();

    const data = factory.build({ a: 1 });

    expect(data).toStrictEqual({ a: 1, b: 0 });
  });

  test("does not reuse provided params between builds", () => {
    const factory = TestFactory.create();

    const data1 = factory.build({ a: 1 });
    const data2 = factory.build({ b: 1 });

    expect(data1).toStrictEqual({ a: 1, b: 0 });
    expect(data2).toStrictEqual({ a: 0, b: 1 });
  });

  test("merges factory params with build params", () => {
    const factory = TestFactory.create();

    const data = factory.refine({ a: 1 }).build({ b: 1 });

    expect(data).toStrictEqual({ a: 1, b: 1 });
  });

  test("works with primitive values as factory shape", () => {
    class TestFactory extends Factory<number> {
      protected override construct() {
        return 1;
      }
    }
    const factory = TestFactory.create();

    const data1 = factory.build();
    const data2 = factory.build(2);
    const data3 = factory.build(3);

    expect(data1).toBe(1);
    expect(data2).toBe(2);
    expect(data3).toBe(3);
  });
});

suite("Factory.prototype.buildMany", () => {
  test("builds a list of data with the given length", () => {
    const factory = TestFactory.create();

    const list = factory.buildMany(3);

    expect(list).toHaveLength(3);
    expect(list).toStrictEqual([
      { a: 0, b: 0 },
      { a: 0, b: 0 },
      { a: 0, b: 0 },
    ]);
  });

  test("applies given params to each list entry", () => {
    const factory = TestFactory.create();

    const list = factory.buildMany(3, { a: 1 });

    expect(list).toHaveLength(3);
    expect(list).toStrictEqual([
      { a: 1, b: 0 },
      { a: 1, b: 0 },
      { a: 1, b: 0 },
    ]);
  });

  test("accepts a function as params and provided the current index and list to it", () => {
    const paramsFn = vi.fn((i: number, list: unknown[]) => ({
      a: i,
      b: list.length,
    }));
    const factory = TestFactory.create();

    const list = factory.buildMany(3, paramsFn);

    expect(paramsFn).toHaveBeenCalledTimes(3);
    expect(list).toStrictEqual([
      { a: 0, b: 0 },
      { a: 1, b: 1 },
      { a: 2, b: 2 },
    ]);
  });
});
