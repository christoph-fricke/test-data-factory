# test-data-factory

## 0.2.0

### Minor Changes

- [#8](https://github.com/christoph-fricke/test-data-factory/pull/8) [`693eebf`](https://github.com/christoph-fricke/test-data-factory/commit/693eebf3e6dcd23d89df691699885ab717e37701) Thanks [@christoph-fricke](https://github.com/christoph-fricke)! - Added an abstract `AbstractStore` class as a contract between factories and stores.

- [#13](https://github.com/christoph-fricke/test-data-factory/pull/13) [`772c52f`](https://github.com/christoph-fricke/test-data-factory/commit/772c52ffcc229c901833ca1edcfc51f00a041071) Thanks [@christoph-fricke](https://github.com/christoph-fricke)! - Added `Store` class as an in-memory test-data store. The store implements the contract defined by `AbstractStore` to be usable with factories.

- [#8](https://github.com/christoph-fricke/test-data-factory/pull/8) [`693eebf`](https://github.com/christoph-fricke/test-data-factory/commit/693eebf3e6dcd23d89df691699885ab717e37701) Thanks [@christoph-fricke](https://github.com/christoph-fricke)! - Added `seed()` and `seedMany()` methods to factories, which insert built test-data into a given store. They accept any store that extends the `AbstractStore` class.

## 0.1.0

### Minor Changes

- [#6](https://github.com/christoph-fricke/test-data-factory/pull/6) [`135c61a`](https://github.com/christoph-fricke/test-data-factory/commit/135c61ab11dd37189b7e21c44993f1bf6971aa33) Thanks [@christoph-fricke](https://github.com/christoph-fricke)! - Added `defineFactory` shorthand for creating lightweight factories through inline functions.

- [#6](https://github.com/christoph-fricke/test-data-factory/pull/6) [`135c61a`](https://github.com/christoph-fricke/test-data-factory/commit/135c61ab11dd37189b7e21c44993f1bf6971aa33) Thanks [@christoph-fricke](https://github.com/christoph-fricke)! - Added `Factory` class for creating powerful factories. Factories provide a flexible API for building data.
