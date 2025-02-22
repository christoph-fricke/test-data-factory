import { expect, suite, test } from "vitest";
import { hello } from "./temp.js";

suite("hello", () => {
  test("returns a greeting", () => {
    expect(hello).toBe("Hello, World.");
  });
});
