import { expect, suite, test, vi } from "vitest";
import { defineFactory } from "./factory-shorthand.ts";
import { Factory } from "./factory.ts";

suite(defineFactory, () => {
  test("returns a new factory instance", () => {
    const factory = defineFactory(() => 42);

    expect(factory).toBeInstanceOf(Factory);
  });

  test("calls the given construct function when building data", () => {
    const construct = vi.fn().mockReturnValue(42);
    const factory = defineFactory<number>(construct);

    const result = factory.build(21);

    expect(result).toBe(21);
    expect(construct).toHaveBeenCalledTimes(1);
    expect(construct).toHaveBeenCalledWith({ sequence: 0, params: 21 });
  });
});
