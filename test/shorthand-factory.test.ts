import { defineFactory } from "test-data-factory";
import { expect, suite, test } from "vitest";

interface Task {
  id: number;
  name: string;
  status: "open" | "completed";
}

suite("Shorthand Factory", () => {
  test("builds data based on the construct function", () => {
    const factory = defineFactory<Task>((ctx) => ({
      id: ctx.sequence,
      name: `Task ${ctx.sequence}`,
      status: "open",
    }));

    const task = factory.build();

    expect(task).toMatchInlineSnapshot(`
      {
        "id": 0,
        "name": "Task 0",
        "status": "open",
      }
    `);
  });

  test("builds a list of data", () => {
    const factory = defineFactory<Task>((ctx) => ({
      id: ctx.sequence,
      name: `Task ${ctx.sequence}`,
      status: "open",
    }));

    const tasks = factory.buildMany(2);

    expect(tasks).toMatchInlineSnapshot(`
      [
        {
          "id": 0,
          "name": "Task 0",
          "status": "open",
        },
        {
          "id": 1,
          "name": "Task 1",
          "status": "open",
        },
      ]
    `);
  });
});
