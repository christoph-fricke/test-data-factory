import { Factory, type ConstructFn, type Params } from "test-data-factory";
import { expect, suite, test } from "vitest";

suite("Custom Context", () => {
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

  test("allows class factories to use a custom build-context", () => {
    class TestFactory extends BaseFactory<string> {
      protected override construct(): string {
        return this.ctx.value;
      }
    }

    const factory = TestFactory.create();
    const data = factory.build();

    expect(data).toMatchInlineSnapshot(`"Value from Context"`);
  });

  test("allows shorthand factories to use a custom build-context", () => {
    // Currently the only way to create a shorthand with custom context.
    function defineFactory<Shape>(
      construct: ConstructFn<Shape, BaseFactory<Shape>>,
    ): BaseFactory<Shape> {
      class InlineFactory extends BaseFactory<Shape> {
        protected override construct(): Shape {
          return construct(this.ctx);
        }
      }
      return InlineFactory.create();
    }

    const factory = defineFactory<string>((ctx) => ctx.value);
    const data = factory.build();

    expect(data).toMatchInlineSnapshot(`"Value from Context"`);
  });
});
