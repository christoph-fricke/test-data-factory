# test-data-factory

## 0.3.0

### Minor Changes

- [#21](https://github.com/christoph-fricke/test-data-factory/pull/21) [`c927424`](https://github.com/christoph-fricke/test-data-factory/commit/c927424a9ba3d2dc41dbc3e04585f52f32dfc831) Thanks [@christoph-fricke](https://github.com/christoph-fricke)! - Added the abstract `AbstractStore` class to the package exports.

- [#19](https://github.com/christoph-fricke/test-data-factory/pull/19) [`5c5a1eb`](https://github.com/christoph-fricke/test-data-factory/commit/5c5a1ebf27283509a03e9ce04851ae1c48fe9697) Thanks [@christoph-fricke](https://github.com/christoph-fricke)! - Changed the publishing flow to use [trusted publishing](https://docs.npmjs.com/trusted-publishers) via OIDC instead of a token-based approach.

- [#21](https://github.com/christoph-fricke/test-data-factory/pull/21) [`c927424`](https://github.com/christoph-fricke/test-data-factory/commit/c927424a9ba3d2dc41dbc3e04585f52f32dfc831) Thanks [@christoph-fricke](https://github.com/christoph-fricke)! - Exposed the `ShapeFor<Factory>` helper type to the package exports. It returns the data shape of a given factory.

- [#18](https://github.com/christoph-fricke/test-data-factory/pull/18) [`38a5416`](https://github.com/christoph-fricke/test-data-factory/commit/38a54166005cd263eae1050dc1f20d3e720184e0) Thanks [@christoph-fricke](https://github.com/christoph-fricke)! - Added declaration maps to the build output. Together with packaged source files, this enables proper "Go To Definition" support in editors — jumping directly to the TypeScript source file instead of the declaration file.

## 0.2.0

### Minor Changes

- [#8](https://github.com/christoph-fricke/test-data-factory/pull/8) [`693eebf`](https://github.com/christoph-fricke/test-data-factory/commit/693eebf3e6dcd23d89df691699885ab717e37701) Thanks [@christoph-fricke](https://github.com/christoph-fricke)! - Added an abstract `AbstractStore` class as a contract between factories and stores.

- [#13](https://github.com/christoph-fricke/test-data-factory/pull/13) [`772c52f`](https://github.com/christoph-fricke/test-data-factory/commit/772c52ffcc229c901833ca1edcfc51f00a041071) Thanks [@christoph-fricke](https://github.com/christoph-fricke)! - Added `Store` class as an in-memory test-data store. The store implements the contract defined by `AbstractStore` to be usable with factories.

- [#8](https://github.com/christoph-fricke/test-data-factory/pull/8) [`693eebf`](https://github.com/christoph-fricke/test-data-factory/commit/693eebf3e6dcd23d89df691699885ab717e37701) Thanks [@christoph-fricke](https://github.com/christoph-fricke)! - Added `seed()` and `seedMany()` methods to factories, which insert built test-data into a given store. They accept any store that extends the `AbstractStore` class.

## 0.1.0

### Minor Changes

- [#6](https://github.com/christoph-fricke/test-data-factory/pull/6) [`135c61a`](https://github.com/christoph-fricke/test-data-factory/commit/135c61ab11dd37189b7e21c44993f1bf6971aa33) Thanks [@christoph-fricke](https://github.com/christoph-fricke)! - Added `defineFactory` shorthand for creating lightweight factories through inline functions.

- [#6](https://github.com/christoph-fricke/test-data-factory/pull/6) [`135c61a`](https://github.com/christoph-fricke/test-data-factory/commit/135c61ab11dd37189b7e21c44993f1bf6971aa33) Thanks [@christoph-fricke](https://github.com/christoph-fricke)! - Added `Factory` class for creating powerful factories. Factories provide a flexible API for building data.
