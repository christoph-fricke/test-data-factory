import { applyParams, type Params } from "./params.ts";

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

type DataOrUpdateFn<Shape> = Params<Shape> | ((entry: Shape) => Params<Shape>);

export interface UpdateQuery<Shape, Strict extends boolean = true>
  extends StrictQuery<Shape, Strict> {
  data: DataOrUpdateFn<Shape>;
}

export function applyUpdateQuery<Shape>(
  entry: Shape,
  query: UpdateQuery<Shape, boolean>,
): Shape {
  const update =
    typeof query.data === "function" ? query.data(entry) : query.data;

  return applyParams(entry, update);
}
