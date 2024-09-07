# Font Anatomy Tools for Typescript

[![NPM Version](https://img.shields.io/npm/v/@adam-rocska/font-anatomy.svg)](https://www.npmjs.com/package/@adam-rocska/font-anatomy)
[![License](https://img.shields.io/npm/l/@adam-rocska/font-anatomy)](https://github.com/adam-rocska/font-anatomy-typescript/blob/master/LICENSE)

| Aspect               | Badge                                                                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Minified             | [![Minified](https://badgen.net/bundlephobia/min/@adam-rocska/font-anatomy)](https://bundlephobia.com/package/@adam-rocska/font-anatomy)                      |
| Minified + gzip      | [![Minified + gzip](https://badgen.net/bundlephobia/minzip/@adam-rocska/font-anatomy)](https://bundlephobia.com/package/@adam-rocska/font-anatomy)            |
| Dependency Count     | [![Dependency Count](https://badgen.net/bundlephobia/dependency-count/@adam-rocska/font-anatomy)](https://bundlephobia.com/package/@adam-rocska/font-anatomy) |
| Tree-shaking Support | [![Tree-shaking Support](https://badgen.net/bundlephobia/tree-shaking/@adam-rocska/font-anatomy)](https://bundlephobia.com/package/@adam-rocska/font-anatomy) |

This is a collection of tools for working with font anatomy
in Typescript.

## Installation

```sh
pnpm add @adam-rocska/font-anatomy
```

```sh
npm install @adam-rocska/font-anatomy
```

## Usage

### Command Line Utilities

All utilities do and will assume inputs from `stdin` and
outputs to `stdout`. This is to allow for easy chaining
of commands and general composition.

Example with `pnpx`:

```zsh
cat Poppins-BoldItalic.ttf | pnpx @adam-rocska/font-anatomy -o md > Poppins-BoldItalic.md
```

Example with a global install:

```sh
my-font.ttf | font-anatomy --output-format=md > font-anatomy.md
```

### Library units

```ts
import { fromFontFile } from '@adam-rocska/font-anatomy';
import { relativize } from '@adam-rocska/font-anatomy';

// It takes a `PathLike` so you can pass a string, URL or a `Buffer`
const fontAnatomy = fromFontFile('path/to/font.ttf');
console.log(fontAnatomy);
/// {
///   unitsPerEm: 1000,
///   ascender: 800,
///   descender: -200,
///   xHeight: 500,
///   capHeight: 700
/// }

relativize('unitsPerEm', {
  unitsPerEm: 1000,
  ascender: 800,
  descender: -200,
  xHeight: 500,
  capHeight: 700
});

/// {
///   unitsPerEm: 1,
///   ascender: 0.8,
///   descender: -0.2,
///   xHeight: 0.5,
///   capHeight: 0.7,
/// }

```
