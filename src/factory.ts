import {
  applyParams,
  combineParams,
  evalParamsOrFunc,
  type Params,
  type ParamsOrFunc,
} from "./params.js";

type Phase = (typeof phase)[keyof typeof phase];
const phase = {
  idle: 0,
  building: 1,
} as const;

type ShapeFor<F> = F extends Factory<infer S> ? S : never;
interface FactoryClass<Factory, Shape> {
  new (state: SharedState, params?: Params<Shape>): Factory;
}

export interface FactoryContext<Shape> {
  params?: Params<Shape> | undefined;
  sequence: number;
}

export abstract class Factory<Shape> {
  #state: SharedState;
  #params?: Params<Shape> | undefined;
  #phase: Phase;
  #context: ReturnType<this["createContext"]> | null;

  protected abstract construct(): Shape;

  constructor(state: SharedState, params?: Params<Shape>) {
    this.#state = state;
    this.#params = params;
    this.#phase = phase.idle;
    this.#context = null;
  }

  static create<This>(this: FactoryClass<This, ShapeFor<This>>): This {
    return new this(new SharedState());
  }

  get identifier(): symbol {
    return this.#state.identifier;
  }

  protected get ctx(): ReturnType<this["createContext"]> {
    if (this.#phase !== phase.building || this.#context === null) {
      throw new TypeError(
        "FactoryContext can only be accessed during the 'building' phase.",
      );
    }
    return this.#context;
  }

  // TODO: Ideally, this method is protected. However, when it is protected,
  // it can no longer be used to infer the final factory context.
  createContext(params?: Params<Shape>): FactoryContext<Shape> {
    if (this.#phase !== phase.building) {
      throw new TypeError(
        "createContext is intended to only be used internally.",
      );
    }

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
    this.#phase = phase.building;

    this.#context = this.createContext(params) as ReturnType<
      this["createContext"]
    >;
    const data = this.construct();
    this.#context = null;

    this.#phase = phase.idle;
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
