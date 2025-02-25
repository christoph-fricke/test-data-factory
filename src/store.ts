import { AbstractStore } from "./abstract-store.js";
import type { Factory } from "./factory.js";
import { StoreCollection } from "./store-collection.js";

interface StoreClass<Store> {
  new (): Store;
}

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

  #findCollection<Shape>(
    identifier: symbol,
  ): StoreCollection<Shape> | undefined {
    return this.#collections.get(identifier) as StoreCollection<Shape>;
  }

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

  protected initialize(): Promise<void> {
    return Promise.resolve();
  }

  async reset(): Promise<void> {
    for (const collection of this.#collections.values()) {
      collection.reset();
    }

    await this.initialize();
  }
}
