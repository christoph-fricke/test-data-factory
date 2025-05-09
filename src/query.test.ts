import { expect, suite, test, vi } from "vitest";
import * as params from "./params.js";
import { applyUpdateQuery, assertStrict } from "./query.js";

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

suite("applyUpdateQuery", () => {
  test("calls applyParams with the entry and data", () => {
    const spy = vi.spyOn(params, "applyParams").mockReturnValue({ a: 2 });
    const entry = { a: 0 };

    const result = applyUpdateQuery(entry, {
      where: () => false,
      data: { a: 1 },
    });

    expect(result).toStrictEqual({ a: 2 });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(entry, { a: 1 });
    spy.mockRestore();
  });

  test("calls a given update function with the old entry", () => {
    const spy = vi.spyOn(params, "applyParams").mockReturnValue({ a: 2 });
    const fn = vi.fn().mockReturnValue({ a: 1 });
    const entry = { a: 0 };

    const result = applyUpdateQuery(entry, {
      where: () => false,
      data: fn,
    });

    expect(result).toStrictEqual({ a: 2 });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(entry);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(entry, { a: 1 });
    spy.mockRestore();
  });
});
