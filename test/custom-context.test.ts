import { Factory, type Params } from "test-data-factory";
import { expect, suite, test } from "vitest";

abstract class BaseFactory<Shape> extends Factory<Shape> {
  // The idea is that consumers of the library should be able to customize the
  // context through their own base class. This enables them to add, for example,
  // an instance of Faker to the context, which ensures that all factories use
  // a shared locale.
  override createContext(params?: Params<Shape>) {
    const ctx = super.createContext(params);
    return {
      ...ctx,
      value: "Value from Context",
    };
  }
}

class TestFactory extends BaseFactory<string> {
  protected override construct(): string {
    return this.ctx.value;
  }
}

suite("Custom Context", () => {
  test("allows class factories to use a custom build-context", () => {
    const factory = TestFactory.create();

    const data = factory.build();

    expect(data).toBe("Value from Context");
  });
});
