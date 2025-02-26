import { expect, suite, test } from "vitest";
import { assertStrict } from "./query.js";

suite("assertStrict", () => {
  const where = () => true;

  test("returns null when no entry is provided and strict is false", () => {
    expect(assertStrict({ where, strict: false })).toBe(null);
    expect(assertStrict({ where, strict: false }, undefined)).toBe(null);
  });

  test("returns the entry when it is provided", () => {
    const entry = { a: 0 };

    expect(assertStrict({ where }, entry)).toBe(entry);
    expect(assertStrict({ where, strict: false }, entry)).toBe(entry);
    expect(assertStrict({ where, strict: true }, entry)).toBe(entry);
  });

  test("throws an error when no entry is provided and strict is true", () => {
    const implicit = () => assertStrict({ where });
    const explicit = () => assertStrict({ where, strict: true });

    expect(implicit).toThrowErrorMatchingInlineSnapshot(
      `[TypeError: No entry found in the collection for the given strict query.]`,
    );
    expect(explicit).toThrowErrorMatchingInlineSnapshot(
      `[TypeError: No entry found in the collection for the given strict query.]`,
    );
  });
});
