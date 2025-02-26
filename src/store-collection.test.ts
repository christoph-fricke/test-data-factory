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

suite("StoreCollection.prototype.find", () => {
  test("returns the first entry that matches the query", () => {
    const collection = new StoreCollection<Data>();
    collection.insert({ a: 1, b: 0 });
    collection.insert({ a: 1, b: 1 });
    collection.insert({ a: 0, b: 1 });

    const entry = collection.find({ where: (e) => e.b === 1 });

    expect(entry).toStrictEqual({ a: 1, b: 1 });
  });

  test("throws an error when no entry matches the given query", () => {
    const collection = new StoreCollection<Data>();

    const search = () => collection.find({ where: () => false });

    expect(search).toThrowErrorMatchingInlineSnapshot(
      `[TypeError: No entry found in the collection for the given strict query.]`,
    );
  });

  test("returns null when no entry matches the query and strict is false", () => {
    const collection = new StoreCollection<Data>();

    const entry = collection.find({ strict: false, where: () => false });

    expect(entry).toBe(null);
  });
});

suite("StoreCollection.prototype.findMany", () => {
  test("returns all entries that match the query", () => {
    const collection = new StoreCollection<Data>();
    collection.insert({ a: 1, b: 0 });
    collection.insert({ a: 1, b: 1 });
    collection.insert({ a: 0, b: 1 });

    const entries = collection.findMany({ where: (e) => e.a === 1 });

    expect(entries).toStrictEqual([
      { a: 1, b: 0 },
      { a: 1, b: 1 },
    ]);
  });

  test("returns an empty array when no entries match the query", () => {
    const collection = new StoreCollection<Data>();
    collection.insert({ a: 1, b: 0 });
    collection.insert({ a: 0, b: 1 });

    const entries = collection.findMany({ where: () => false });

    expect(entries).toStrictEqual([]);
  });

  test("returns an empty array when the collection is empty", () => {
    const collection = new StoreCollection<Data>();

    const entries = collection.findMany({ where: () => true });

    expect(entries).toStrictEqual([]);
  });
});
