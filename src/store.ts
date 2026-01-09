import { AbstractStore } from "./abstract-store.ts";
import type { Factory } from "./factory.ts";
import { StoreCollection } from "./store-collection.ts";

interface StoreClass<Store> {
  new (): Store;
}

type DataDump<Store> = Pick<CollectionShapes<Store>, CollectionKeys<Store>>;
type CollectionShapes<Store> = {
  -readonly [Key in keyof Store]: Store[Key] extends StoreCollection<
    infer Shape
  >
    ? Shape[]
    : never;
};
type CollectionKeys<Store> = {
  [Key in keyof Store]: Store[Key] extends StoreCollection<unknown>
    ? Key
    : never;
}[keyof Store];

export abstract class Store extends AbstractStore {
  #collections: Map<symbol, StoreCollection<unknown>>;

  /**
   * **Do not call the constructor directly! Use {@link Store.create} instead.**
   *
   * The constructor cannot call the asynchronous {@link Store.initialize} method.
   * Therefore, you must use {@link Store.create} to properly create a new instance
   * of the store.
   *
   * @private
   */
  constructor() {
    super();
    this.#collections = new Map();
  }

  static async create<This extends Store>(
    this: StoreClass<This>,
  ): Promise<This> {
    const store = new this();
    await store.initialize();
    return store;
  }

  protected initialize(): Promise<void> {
    return Promise.resolve();
  }

  #findCollection<Shape>(
    identifier: symbol,
  ): StoreCollection<Shape> | undefined {
    return this.#collections.get(identifier) as StoreCollection<Shape>;
  }

  /**
   * Implements the {@link AbstractStore} protocol to interface with
   * {@link Factory|Factories}. This method should not be changed or used directly.
   *
   * Prefer using {@link Factory.seed} and {@link Factory.seedMany} to insert data
   * into the store.
   *
   * @private
   */
  protected override insert<Shape>(identifier: symbol, entry: Shape): boolean {
    const collection = this.#findCollection(identifier);
    if (!collection) return false;

    collection.insert(entry);
    return true;
  }

  protected collection<Shape>(factory: Factory<Shape>): StoreCollection<Shape> {
    if (this.#collections.has(factory.identifier)) {
      throw new TypeError(
        `Collection for factory with the same identifier already exists.`,
      );
    }

    const collection = new StoreCollection<Shape>();
    this.#collections.set(factory.identifier, collection);
    return collection;
  }

  async reset(): Promise<void> {
    for (const collection of this.#collections.values()) {
      collection.reset();
    }

    await this.initialize();
  }

  dump(): DataDump<this> {
    const dump = {} as DataDump<this>;

    for (const key in this) {
      const field = this[key];
      if (!(field instanceof StoreCollection)) continue;

      Object.defineProperty(dump, key, {
        value: field.all(),
        enumerable: true,
      });
    }

    return dump;
  }
}
