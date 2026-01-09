import { expect, suite, test, vi } from "vitest";
import { applyParams, combineParams, evalParamsOrFunc } from "./params.ts";

suite.for([applyParams, combineParams])("%o shared", (paramsFn) => {
  test("returns the given entry when no params are provided", () => {
    expect(paramsFn(1)).toBe(1);
    expect(paramsFn({ a: 0 })).toStrictEqual({ a: 0 });
    expect(paramsFn([{ a: 0 }])).toStrictEqual([{ a: 0 }]);
  });

  test("overwrites primitive values", () => {
    expect(paramsFn<number>(1, 2)).toBe(2);
    expect(paramsFn<string>("", "test")).toBe("test");
    expect(paramsFn<boolean>(true, false)).toBe(false);
    expect(paramsFn<null | string>(null, "")).toBe("");
    expect(paramsFn<undefined | null>(undefined, null)).toBe(null);
    expect(paramsFn<bigint>(BigInt(2), BigInt(4))).toBe(BigInt(4));
    expect(paramsFn<symbol>(Symbol.for("a"), Symbol.for("b"))).toBe(
      Symbol.for("b"),
    );
  });

  test("does not mutate given objects", () => {
    const entry = { a: 0, b: { c: 0, d: 0 } };

    const flat = paramsFn(entry, { a: 1 });
    const deep = paramsFn(entry, { b: { c: 0 } });

    expect(flat).not.toBe(entry);
    expect(deep?.b).not.toBe(entry.b);
    expect(entry).toStrictEqual(entry);
  });

  test("overwrites object values recursively", () => {
    const entry = { a: 0, b: { c: 0, d: 0 } };

    const flat = paramsFn(entry, { a: 1 });
    const deep = paramsFn(entry, { b: { c: 1 } });

    expect(flat).toStrictEqual({ a: 1, b: { c: 0, d: 0 } });
    expect(deep).toStrictEqual({ a: 0, b: { c: 1, d: 0 } });
  });

  test("overwrites an array when params is no array", () => {
    const base: { a: { b: number }[] | null } = { a: [{ b: 0 }] };

    const result = paramsFn(base, { a: null });

    expect(result).not.toBe(base);
    expect(result).toStrictEqual({ a: null });
  });

  test("does not apply undefined when called with primitive entries", () => {
    // This limitation avoids downstream problems with optional arguments that
    // will be "undefined" inside the function... It enables factories for primitives.
    expect(paramsFn<number>(1, undefined)).toBe(1);
    expect(paramsFn<string>("", undefined)).toBe("");
  });

  test("does apply undefined when called with object entries", () => {
    const entry: {
      a?: number | undefined;
      b: { c?: number | undefined; d: number };
    } = { a: 0, b: { c: 0, d: 0 } };

    const flat = paramsFn(entry, { a: undefined });
    const deep = paramsFn(entry, { b: { c: undefined } });

    expect(flat).toStrictEqual({ a: undefined, b: { c: 0, d: 0 } });
    expect(deep).toStrictEqual({ a: 0, b: { c: undefined, d: 0 } });
  });

  test("avoids deep merging non-plain objects objects", () => {
    const date = new Date("2024-01-18");
    const date2 = new Date("2025-01-18");

    const result = paramsFn({ date }, { date: date2 });

    expect(result?.date).toBe(date2);
  });
});

suite(applyParams, () => {
  test("preserves arrays when params is also an array", () => {
    const base = [{ a: 0 }];

    const result = applyParams(base, [{}, {}]);

    expect(result).toBe(base);
    expect(result).toStrictEqual([{ a: 0 }]);
  });

  test("preserves arrays nested in objects when params is also an array", () => {
    const base = { a: [{ b: 0 }] };

    const result = applyParams(base, { a: [{}, {}] });

    expect(result).not.toBe(base);
    expect(result).toStrictEqual({ a: [{ b: 0 }] });
  });
});

suite(combineParams, () => {
  test("overwrites arrays when params is also an array", () => {
    const base = [{ a: 0 }];

    const result = combineParams(base, [{}, {}]);

    expect(result).not.toBe(base);
    expect(result).toStrictEqual([{}, {}]);
  });

  test("overwrites arrays nested in objects when params is also an array", () => {
    const base = { a: [{ b: 0 }] };

    const result = combineParams(base, { a: [{}, {}] });

    expect(result).not.toBe(base);
    expect(result).toStrictEqual({ a: [{}, {}] });
  });
});

suite(evalParamsOrFunc, () => {
  test("returns undefined when params are undefined", () => {
    const result = evalParamsOrFunc(0, [], undefined);

    expect(result).toBeUndefined();
  });

  test("returns params when try are a value", () => {
    const params = {};
    const result = evalParamsOrFunc<object>(0, [], params);

    expect(result).toBe(params);
  });

  test("evaluates params when try are a function", () => {
    const params = vi.fn().mockReturnValue({ a: 0 });
    const result = evalParamsOrFunc(2, [{ a: 0 }, { a: 1 }], params);

    expect(params).toHaveBeenCalledTimes(1);
    expect(params).toHaveBeenNthCalledWith(1, 2, [{ a: 0 }, { a: 1 }]);
    expect(result).toStrictEqual({ a: 0 });
  });
});
