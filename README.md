# unplugin-mtl

[![NPM version](https://img.shields.io/npm/v/unplugin-mtl?color=a1b858&label=)](https://www.npmjs.com/package/unplugin-mtl)

An [`.mtl`](https://en.wikipedia.org/wiki/Wavefront_.obj_file#Basic_materials) file import plugin for Vite, Rollup, and Webpack; built with [unplugin](https://github.com/unjs/unplugin). This gives you a sweet and simple way to import an `.mtl` file as a string to, for example, parse into a mesh in something like [three.js](https://threejs.org/), or do whatever you want with.

Credit to the inspiration from: [unplugin-obj](https://github.com/tonyketcham/unplugin-obj)

## Usage

Here's a simple example which imports an `.mtl` file as a string then logs it to the console.

```ts
import mtl from './models/Lowpoly_tree_sample.mtl';

console.log(mtl);

// ...optionally parse the mtl file and create a mesh from it...
```

> TypeSript & eslint may yell at you for trying to import a module where one doesn't exist without this plugin, so you can ask it to stop using the above comments before the import

## Install

```bash
pnpm i -D unplugin-mtl
```

## Types

The most generally compatible way to add type definitions for `.mtl` modules is via a `tsconfig.json` file.

```js
// tsconfig.json
{
  "compilerOptions": {
    ...
    "types": ["unplugin-mtl/mtl"]
  }
}
```

### Vite

```ts
// vite.config.ts
import MtlFileImport from 'unplugin-mtl/vite';

export default defineConfig({
  plugins: [MtlFileImport()],
});
```

Optional method to add types w/o `tsconfig`:

```ts
// vite-env.d.ts
/// <reference types="unplugin-mtl/mtl" />
```

Example: [`playground/`](./playground/)

### Rollup

```ts
// rollup.config.js
import MtlileImport from 'unplugin-mtl/rollup';

export default {
  plugins: [MtlFileImport()],
};
```

### Webpack

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [require('unplugin-mtl/webpack')()],
};
```

### SvelteKit

```ts
// svelte.config.js
/* ... */
import MtlFileImport from 'unplugin-mtl/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  /* ... */
  kit: {
    /* ... */
    vite: {
      /* ... */
      plugins: [MtlFileImport()],
    },
  },
};

export default config;
```

### Nuxt

```ts
// nuxt.config.js
export default {
  buildModules: [['unplugin-mtl/nuxt']],
};
```

> This module works for both Nuxt 2 and [Nuxt Vite](https://github.com/nuxt/vite)

### Vue CLI

```ts
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [require('unplugin-mtl/webpack')()],
  },
};
```
