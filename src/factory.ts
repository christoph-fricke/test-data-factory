import {
  applyParams,
  combineParams,
  evalParamsOrFunc,
  type Params,
  type ParamsOrFunc,
} from "./params.js";

type ShapeFor<F> = F extends Factory<infer S> ? S : never;
interface FactoryClass<Factory, Shape> {
  new (state: SharedState, params?: Params<Shape>): Factory;
}

// This is a bit cursed but works and helps to keep "createContext" protected,
// while allowing consumers to extend the build context...
// Alternative is to make "createContext" public, but than it gets suggested and
// has to throw when unintentionally called outside the factory.
export type Context<F extends Factory<unknown>> = ReturnType<
  // @ts-expect-error Protected member 'createContext' cannot be accessed on a type parameter.
  F["createContext"]
>;

export interface FactoryContext<Shape> {
  params?: Params<Shape> | undefined;
  sequence: number;
}

export abstract class Factory<Shape> {
  #state: SharedState;
  #params?: Params<Shape> | undefined;
  #context: Context<this> | null;

  protected abstract construct(): Shape;

  /**
   * **Do not call the constructor directly! Use {@link Factory.create} instead.**
   *
   * The constructor requires arguments that should not concern you.
   * It is only used internally for factory creation and refinement. It only has
   * to remain public in TypeScript to be able to extend an factory.
   *
   * @private
   */
  constructor(state: SharedState, params?: Params<Shape>) {
    this.#state = state;
    this.#params = params;
    this.#context = null;
  }

  static create<This>(this: FactoryClass<This, ShapeFor<This>>): This {
    return new this(new SharedState());
  }

  get identifier(): symbol {
    return this.#state.identifier;
  }

  protected get ctx(): Context<this> {
    if (this.#context === null) {
      throw new TypeError(
        "FactoryContext can only be accessed in the `construct` method.",
      );
    }
    return this.#context;
  }

  protected createContext(params?: Params<Shape>): FactoryContext<Shape> {
    return {
      sequence: this.#state.next(),
      params,
    };
  }

  reset(): void {
    this.#state.reset();
  }

  refine(params: Params<Shape>): this {
    const Constructor = this.constructor as FactoryClass<this, Shape>;
    return new Constructor(this.#state, combineParams(this.#params, params));
  }

  build(params?: Params<Shape>): Shape {
    params = combineParams(this.#params, params);

    this.#context = this.createContext(params) as Context<this>;
    const data = this.construct();
    this.#context = null;

    return applyParams(data, params);
  }

  buildMany(amount: number, params?: ParamsOrFunc<Shape>): Shape[] {
    const list: Shape[] = [];
    for (let i = 0; i < amount; i++) {
      const p = evalParamsOrFunc(i, list, params);
      list.push(this.build(p));
    }
    return list;
  }
}

class SharedState {
  static initialSequence = 0;
  readonly identifier: symbol;

  #sequence: number;

  constructor() {
    this.identifier = Symbol("factory");
    this.#sequence = SharedState.initialSequence;
  }

  next(): number {
    return this.#sequence++;
  }

  reset(): void {
    this.#sequence = SharedState.initialSequence;
  }
}
