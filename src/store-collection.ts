export class StoreCollection<Shape> {
  #entries: Shape[];

  constructor() {
    this.#entries = [];
  }

  get size(): number {
    return this.#entries.length;
  }

  reset(): void {
    this.#entries = [];
  }

  all(): Shape[] {
    return Array.from(this.#entries);
  }

  latest(): Shape {
    const entry = this.#entries.at(-1);
    if (!entry) throw new TypeError("Collection contains no entries.");
    return entry;
  }

  insert(entry: Shape): Shape {
    this.#entries.push(entry);
    return entry;
  }
}
