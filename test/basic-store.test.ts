import { defineFactory, Store } from "test-data-factory";
import { beforeEach, expect, suite, test } from "vitest";

interface Task {
  id: number;
  name: string;
  status: "open" | "completed";
}

const taskFactory = defineFactory<Task>((ctx) => ({
  id: ctx.sequence,
  name: `Task ${ctx.sequence}`,
  status: "open",
}));

class DataStore extends Store {
  readonly tasks = this.collection(taskFactory);

  protected override async initialize() {
    await taskFactory.seed(this);
  }
}

suite("Basic Store", () => {
  beforeEach(() => void taskFactory.reset());

  test("initializes the store with test-data", async () => {
    const store = await DataStore.create();

    expect(store.tasks.latest()).toMatchInlineSnapshot(`
      {
        "id": 0,
        "name": "Task 0",
        "status": "open",
      }
    `);
  });

  test("inserts additional test-data", async () => {
    const store = await DataStore.create();

    taskFactory.seed(store, { status: "completed" });

    expect(store.tasks.size).toBe(2);
    expect(store.tasks.latest()).toMatchInlineSnapshot(`
      {
        "id": 1,
        "name": "Task 1",
        "status": "completed",
      }
    `);
  });

  test("resets and re-initializes the store", async () => {
    const store = await DataStore.create();

    const entry = store.tasks.latest();
    await store.reset();

    expect(store.tasks.latest()).not.toBe(entry);
  });
});
