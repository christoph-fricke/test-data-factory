import { Factory } from "./factory.js";

export interface ConstructFn<Shape, F extends Factory<Shape>> {
  (ctx: ReturnType<F["createContext"]>): Shape;
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
 * If you extend {@link Factory} with your own base factory base, you can create
 * your own factory shorthand that works for you base factory. The following
 * code snippet is a great starting point for this.
 *
 * ```ts
 * abstract class CustomFactory<Shape> extends Factory<Shape> {
 *   // ...your custom base over overrides
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
