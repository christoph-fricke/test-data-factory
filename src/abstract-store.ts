/** A minimal interface that must be implemented by a store to interface with factories. */
export abstract class AbstractStore {
  /**
   * Inserts an entry from the given factory identifier into the store.
   * This function can optionally be asynchronous.
   *
   * @returns `true` if the entry was successfully inserted, `false` otherwise.
   */
  protected abstract insert<Shape>(
    identifier: symbol,
    entry: Shape,
  ): boolean | Promise<boolean>;
}
