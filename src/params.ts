/* eslint-disable @typescript-eslint/no-explicit-any */
export type Params<Shape> = DeepPartial<Shape>;
type DeepPartial<T> = T extends (infer I)[]
  ? DeepPartial<I>[]
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : Partial<T>;

/** Deeply applies partial params to the given entry. Arrays in params **are not** applied.*/
export function applyParams<Shape>(
  entry: Shape,
  params?: Params<Shape>,
): Shape {
  // Shortcut when no params have been provided.
  if (typeof params === "undefined") return entry;

  return applyParamsRecursive(entry, params, { preserveArrays: true });
}

/** Deeply combines partial params. Arrays in params **are** overwritten.*/
export function combineParams<Shape>(
  params?: Params<Shape>,
  newParams?: Params<Shape>,
): Params<Shape> | undefined {
  // Shortcut when no new params have been provided.
  if (typeof newParams === "undefined") return params;

  return applyParamsRecursive(params, newParams, { preserveArrays: false });
}

interface Config {
  // We cannot safely apply params for arrays. Reason: entry is build as an empty array,
  // and params is an array with two partial inner entries. How can they be added
  // without leaving partially complete data in the final build result? - They cant.
  // When combining params, they must be applied as the latest params should be used...
  preserveArrays?: boolean;
}

function applyParamsRecursive(entry: any, params: any, config: Config): any {
  if (config.preserveArrays && Array.isArray(entry) && Array.isArray(params)) {
    return entry;
  }

  if (isPlainObject(entry) && isPlainObject(params)) {
    const shallowEntry = Object.assign({}, entry);
    for (const key in params) {
      const entryVal = entry[key];
      const paramVal = params[key];

      shallowEntry[key] = applyParamsRecursive(entryVal, paramVal, config);
    }
    return shallowEntry;
  }

  return params;
}

function isPlainObject(value: unknown): value is Record<PropertyKey, any> {
  if (typeof value !== "object" || value === null) return false;

  return Object.getPrototypeOf(value) === Object.prototype;
}

export type ParamsOrFunc<Shape> =
  | Params<Shape>
  | ((index: number, list: Shape[]) => Params<Shape>);

export function evalParamsOrFunc<Shape>(
  i: number,
  list: Shape[],
  params?: ParamsOrFunc<Shape>,
): Params<Shape> | undefined {
  return typeof params === "function" ? params(i, list) : params;
}
