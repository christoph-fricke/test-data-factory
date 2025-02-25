<h1 align="center">Test Data Factory</h1>

> **🚧 This package is under heavy development. Documentation is currently
> lacking and will be added later. Feel free to explore, adventurer! 🚧**

## Installation

You can install _Test Data Factory_ with this shell command:

```bash
npm i -D test-data-factory
```

## Usage Guide

_Test Data Factory_ is based on two main concepts:

- **Factories** for defining and creating test-data.
- **Stores** as a pluggable test-data storage mechanism that is seeded by
  factories.

Stores are a powerful but completely optional concept. They interface well with
factories, but factories are designed to be used standalone. Even if you do not
end up using stores, _Test Data Factory_ can still provide you a powerful and
flexible `Factory` API for defining and creating test-data.

### Factories

```typescript
import { Factory } from "test-data-factory";

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
const factory = TaskFactory.create();

// Build a task without any overrides
const task = factory.build();
// Provide params to override the result
const task = factory.build({ name: "Check Mailbox" });
// Builds a completed task
const task = factory.completed.build();
```

### Factory Shorthand

```typescript
import { defineFactory } from "test-data-factory";

const factory = defineFactory<string>((ctx) => `T-${ctx.sequence}`);

// Shorthand factories can be used like "normal factories"
const id = factory.build();
const ids = factory.buildMany(3);
```

## Advanced Usage

### Extend the Factory Context

You can create your own base factory that adds additional functionality for all
factories. Importantly, you can extend the `FactoryContext` that is available in
the `construct` method of both 'class-based' and shorthand factories.

For example, you could add an instance of [Faker](https://fakerjs.dev/) to the
context, which can ensure that all factories use the same locale.

```typescript
import { Factory, type ConstructFn, type Params } from "test-data-factory";
import { faker } from "@faker-js/faker/locale/de";

export abstract class BaseFactory<Shape> extends Factory<Shape> {
  protected readonly faker = faker;

  protected override createContext(params?: Params<Shape>) {
    const ctx = super.createContext(params);
    return {
      ...ctx,
      faker: this.faker,
    };
  }
}

// Create your own shorthand Factory that uses your custom context.
export function defineFactory<Shape>(
  construct: ConstructFn<Shape, BaseFactory<Shape>>,
): BaseFactory<Shape> {
  class InlineFactory extends BaseFactory<Shape> {
    protected override construct(): Shape {
      return construct(this.ctx);
    }
  }
  return InlineFactory.create();
}
```

## License

This package is published under the [MIT license](./LICENSE).
