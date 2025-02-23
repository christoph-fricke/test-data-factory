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

    const data = factory.build();

    expect(data).toMatchInlineSnapshot(`
      {
        "id": 0,
        "name": "Task 0",
        "status": "open",
      }
    `);
  });

  test("builds refined version of the constructed data", () => {
    const factory = TaskFactory.create();

    const data = factory.completed.build();

    expect(data).toMatchInlineSnapshot(`
      {
        "id": 0,
        "name": "Task 0",
        "status": "completed",
      }
    `);
  });
});
