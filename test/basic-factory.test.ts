import { Factory } from "test-data-factory";
import { expect, suite, test } from "vitest";

interface Task {
  id: number;
  name: string;
  status: "open" | "completed";
}

class TaskFactory extends Factory<Task> {
  protected override construct(): Task {
    return {
      id: this.ctx.sequence,
      name: `Task ${this.ctx.sequence}`,
      status: "open",
    };
  }

  get completed() {
    return this.refine({ status: "completed" });
  }
}

suite("Basic Factory", () => {
  test("builds data based on the construct overwrite", () => {
    const factory = TaskFactory.create();

    const task = factory.build();

    expect(task).toMatchInlineSnapshot(`
      {
        "id": 0,
        "name": "Task 0",
        "status": "open",
      }
    `);
  });

  test("builds a refined version of the constructed data", () => {
    const factory = TaskFactory.create();

    const task = factory.completed.build();

    expect(task).toMatchInlineSnapshot(`
      {
        "id": 0,
        "name": "Task 0",
        "status": "completed",
      }
    `);
  });

  test("builds a list of data", () => {
    const factory = TaskFactory.create();

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
