import { hello } from "test-data-factory";
import { expect, suite, test } from "vitest";

suite("Greeting", () => {
  test("greets the world", () => {
    expect(hello).toBe("Hello, World.");
  });
});
