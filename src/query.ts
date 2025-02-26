export interface Query<Shape> {
  where(entry: Shape): boolean;
}

export interface StrictQuery<Shape, Strict extends boolean = true>
  extends Query<Shape> {
  /** @default true */
  strict?: Strict;
}

export function assertStrict<Shape>(
  query: StrictQuery<Shape, boolean>,
  entry?: Shape,
): Shape | null {
  if (entry) return entry;

  // strict mode is the default
  if (query.strict !== false) {
    throw new TypeError(
      "No entry found in the collection for the given strict query.",
    );
  }

  return null;
}
