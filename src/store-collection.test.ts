import { expect, suite, test } from "vitest";
import { StoreCollection } from "./store-collection.js";

interface Data {
  a: number;
  b: number;
}

suite("StoreCollection.constructor", () => {
  test("creates an empty collection", () => {
    const collection = new StoreCollection();

    expect(collection.all()).toStrictEqual([]);
  });
});

suite("StoreCollection.prototype.size", () => {
  test("returns the number of entries in the collection", () => {
    const collection = new StoreCollection<Data>();
    expect(collection.size).toBe(0);

    collection.insert({ a: 0, b: 0 });
    expect(collection.size).toBe(1);

    collection.insert({ a: 0, b: 0 });
    expect(collection.size).toBe(2);
  });
});

suite("StoreCollection.prototype.reset", () => {
  test("removes stored entries from the collection", () => {
    const collection = new StoreCollection<Data>();
    collection.insert({ a: 0, b: 0 });
    collection.insert({ a: 0, b: 0 });

    collection.reset();

    expect(collection.all()).toStrictEqual([]);
  });
});

suite("StoreCollection.prototype.all", () => {
  test("returns all entries in the collection", () => {
    const collection = new StoreCollection<Data>();
    const entries = [
      { a: 0, b: 0 },
      { a: 0, b: 0 },
    ] as const;

    collection.insert(entries[0]);
    collection.insert(entries[1]);

    expect(collection.all()).toStrictEqual(entries);
  });
});

suite("StoreCollection.prototype.latest", () => {
  test("returns the latest entry in the collection", () => {
    const collection = new StoreCollection<Data>();
    const entries = [
      { a: 0, b: 0 },
      { a: 0, b: 0 },
    ] as const;

    collection.insert(entries[0]);
    collection.insert(entries[1]);

    expect(collection.latest()).toStrictEqual(entries[1]);
  });

  test("throws an error if the collection is empty", () => {
    const collection = new StoreCollection<Data>();

    const call = () => collection.latest();

    expect(call).toThrowErrorMatchingInlineSnapshot(
      `[TypeError: Collection contains no entries.]`,
    );
  });
});

suite("StoreCollection.prototype.insert", () => {
  test("inserts an entry into the collection", () => {
    const collection = new StoreCollection<Data>();
    const entry = { a: 0, b: 0 };

    const result = collection.insert(entry);

    expect(result).toBe(entry);
    expect(collection.latest()).toStrictEqual(entry);
  });
});
