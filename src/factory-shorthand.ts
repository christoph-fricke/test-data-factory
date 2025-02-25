import { Factory, type Context } from "./factory.ts";

export interface ConstructFn<Shape, F extends Factory<Shape>> {
  (ctx: Context<F>): Shape;
}

/**
 * Shorthand for creating a new factory based on the given `construct` function.
 * This is useful for quick and basic factories. For creating advanced factories,
 * you should consider extending the {@link Factory} class instead.
 *
 * ```ts
 * interface Person {
 *   name: string;
 *   age: number;
 * }
 *
 * const factory = defineFactory<Person>(() => ({
 *   name: "Example Person",
 *   age: 18,
 * }));
 *
 * const person = factory.build({ age: 21 });
 * ```
 *
 * ---
 *
 * If you extend {@link Factory} with your own base factory, you can create a
 * factory shorthand that is based on your base factory. The following code
 * snippet is a great starting point for this.
 *
 * ```ts
 * abstract class CustomFactory<Shape> extends Factory<Shape> {
 *   // ...your custom base overrides
 * }
 *
 * export function defineFactory<Shape>(
 *   construct: ConstructFn<Shape, CustomFactory<Shape>>,
 * ): CustomFactory<Shape> {
 *   class InlineFactory extends CustomFactory<Shape> {
 *     protected override construct(): Shape {
 *       return construct(this.ctx);
 *     }
 *   }
 *   return InlineFactory.create();
 * }
 * ```
 */
export function defineFactory<Shape>(
  construct: ConstructFn<Shape, Factory<Shape>>,
): Factory<Shape> {
  class InlineFactory extends Factory<Shape> {
    protected override construct(): Shape {
      return construct(this.ctx);
    }
  }
  return InlineFactory.create();
}
