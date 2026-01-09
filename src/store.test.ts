import { expect, suite, test, vi } from "vitest";
import { AbstractStore } from "./abstract-store.ts";
import { defineFactory } from "./factory-shorthand.ts";
import { StoreCollection } from "./store-collection.ts";
import { Store } from "./store.ts";

suite("Store.create", () => {
  test("creates a new instance of the implementing store class", async () => {
    class TestStore extends Store {}

    const store = await TestStore.create();

    expect(store).toBeInstanceOf(TestStore);
    expect(store).toBeInstanceOf(Store);
    expect(store).toBeInstanceOf(AbstractStore);
  });

  test("calls initialize in the new instance", async () => {
    const initFn = vi.fn();

    class TestStore extends Store {
      protected override initialize = initFn;
    }
    await TestStore.create();

    expect(initFn).toHaveBeenCalledTimes(1);
  });
});

suite("Store.prototype.initialize", () => {
  test("can be overridden to seed a created instance with data", async () => {
    const factory = defineFactory(() => 0);
    class TestStore extends Store {
      protected override async initialize() {
        await factory.seed(this);
      }
    }

    const spy = vi.spyOn(factory, "seed").mockResolvedValue(1);
    const store = await TestStore.create();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(store);
  });
});

suite("Store.prototype.collection", () => {
  const factory = defineFactory(() => 0);

  test("creates a new collection from a given factory", async () => {
    class TestStore extends Store {
      test = this.collection(factory);
    }

    const store = await TestStore.create();

    expect(store.test).toBeInstanceOf(StoreCollection);
  });

  test("throws an error when a factory is already registered", async () => {
    class TestStore extends Store {
      test = this.collection(factory);
      test2 = this.collection(factory);
    }

    const call = () => TestStore.create();

    await expect(call).rejects.toThrowErrorMatchingInlineSnapshot(
      `[TypeError: Collection for factory with the same identifier already exists.]`,
    );
  });
});

suite("Store.prototype.insert", () => {
  const factory = defineFactory(() => 0);
  class TestStore extends Store {
    test = this.collection(factory);
  }

  test("return false when given factory identifier is unknown", async () => {
    const store = await TestStore.create();

    const result = store["insert"](Symbol("factory"), 0);

    expect(result).toBe(false);
  });

  test("return true when given factory identifier is unknown", async () => {
    const store = await TestStore.create();

    const result = store["insert"](factory.identifier, 0);

    expect(result).toBe(true);
  });

  test("inserts given data into the registered collection", async () => {
    const store = await TestStore.create();
    const spy = vi.spyOn(store.test, "insert").mockReturnValue(-1);

    const result = store["insert"](factory.identifier, 42);

    expect(result).toBe(true);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(42);
  });
});

suite("Store.prototype.reset", () => {
  class TestStore extends Store {
    test1 = this.collection(defineFactory(() => 0));
    test2 = this.collection(defineFactory(() => 0));
  }

  test("calls reset on all registered collections", async () => {
    const store = await TestStore.create();
    const spy1 = vi.spyOn(store.test1, "reset");
    const spy2 = vi.spyOn(store.test2, "reset");

    await store.reset();

    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
  });

  test("calls initialize again after reset", async () => {
    const initFn = vi.fn();
    class TestStore extends Store {
      protected override initialize = initFn;
    }

    const store = await TestStore.create();
    await store.reset();

    expect(initFn).toHaveBeenCalledTimes(2);
  });
});

suite("Store.prototype.dump", () => {
  class TestStore extends Store {
    test1 = this.collection(defineFactory(() => 0));
    test2 = this.collection(defineFactory(() => 0));
  }

  test("returns all data stored in the collections", async () => {
    const store = await TestStore.create();
    vi.spyOn(store.test1, "all").mockReturnValue([1, 2, 3]);
    vi.spyOn(store.test2, "all").mockReturnValue([4, 5, 6]);

    const dump = store.dump();

    expect(dump).toStrictEqual({
      test1: [1, 2, 3],
      test2: [4, 5, 6],
    });
  });

  test("ignores a property when it is no collection", async () => {
    class TestStore extends Store {
      field = new Map();
    }
    const store = await TestStore.create();

    const dump = store.dump();

    expect(dump).toStrictEqual({});
  });
});
