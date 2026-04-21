# Font Anatomy for TypeScript

[![NPM Version](https://img.shields.io/npm/v/@adam-rocska/font-anatomy.svg)](https://www.npmjs.com/package/@adam-rocska/font-anatomy)
[![License](https://img.shields.io/npm/l/@adam-rocska/font-anatomy)](https://github.com/adam-rocska/font-anatomy-typescript/blob/master/LICENSE)

| Aspect               | Badge                                                                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Minified             | [![Minified](https://badgen.net/bundlephobia/min/@adam-rocska/font-anatomy)](https://bundlephobia.com/package/@adam-rocska/font-anatomy)                      |
| Minified + gzip      | [![Minified + gzip](https://badgen.net/bundlephobia/minzip/@adam-rocska/font-anatomy)](https://bundlephobia.com/package/@adam-rocska/font-anatomy)            |
| Dependency Count     | [![Dependency Count](https://badgen.net/bundlephobia/dependency-count/@adam-rocska/font-anatomy)](https://bundlephobia.com/package/@adam-rocska/font-anatomy) |
| Tree-shaking Support | [![Tree-shaking Support](https://badgen.net/bundlephobia/tree-shaking/@adam-rocska/font-anatomy)](https://bundlephobia.com/package/@adam-rocska/font-anatomy) |

Font anatomy is one of those things you keep needing in real projects and somehow still end up rebuilding from scratch.

`@adam-rocska/font-anatomy` is a small Node.js library and CLI for extracting the most useful vertical font metrics from real font binaries:

- `unitsPerEm`
- `ascender`
- `descender`
- `xHeight`
- `capHeight`

It is built for the practical use case:

- inspect a font file quickly
- serialize the anatomy as clean JSON
- generate a Markdown report for docs or audits
- normalize metrics relative to `unitsPerEm` or another metric
- keep working in TypeScript without inventing your own shape every time

## Why This Exists

Most font tooling libraries focus on parsing, rendering, shaping, or editing.
That is useful, but if what you actually need is "give me the anatomy of this font and let me compare it", they are usually too low-level.

This package sits exactly at that layer.

It is intentionally narrow:

- parse a font
- extract anatomy
- keep the API small
- make the output easy to pipe, store, compare, and reuse

## Requirements

- Node.js 20 or newer

## Supported Input Formats

The library currently accepts:

- TTF
- OTF
- WOFF2

WOFF2 input is decompressed automatically before parsing.

## What You Get Back

The core output type is:

```ts
type FontAnatomy<Value extends { valueOf(): number }> = {
  font?: Font;
  unitsPerEm: Value;
  ascender: Value;
  descender: Value;
  xHeight: Value;
  capHeight: Value;
};
```

For the library API, the parsed `opentype.js` `Font` instance is kept on `anatomy.font` when available.
For CLI JSON output, the result is serialized as plain metric data without the embedded font object.

## Installation

```sh
pnpm add @adam-rocska/font-anatomy
```

```sh
npm install @adam-rocska/font-anatomy
```

## CLI

The CLI reads the font from `stdin` and writes to `stdout`, which makes it easy to compose with normal shell tooling.

### JSON output

```sh
cat Poppins-BoldItalic.ttf | font-anatomy
```

Example output:

```json
{
  "unitsPerEm": 1000,
  "ascender": 1050,
  "descender": -350,
  "xHeight": 558,
  "capHeight": 705
}
```

### Markdown output

```sh
cat Poppins-BoldItalic.ttf | font-anatomy --output-format=md > Poppins-BoldItalic.md
```

You can also use the short flag:

```sh
pnpm dlx @adam-rocska/font-anatomy -o md < Poppins-BoldItalic.ttf
```

Markdown output includes:

- localized naming metadata when available
- absolute anatomy values
- relative anatomy values normalized to `unitsPerEm`

### Heading level

For Markdown output, you can control the top heading level:

```sh
cat Poppins-BoldItalic.ttf | font-anatomy -o md --heading-level=2
```

Valid heading levels are `1` through `5`.

## Library API

The public surface is intentionally small:

- `fromFontBinary(buffer)`
- `fromFontFile(path)`
- `fromFont(opentypeFont)`
- `relativize(basedOn, anatomy, numberToValue?)`
- `isFontAnatomy(candidate, isValue?)`
- `FontAnatomyInstance`

### Read directly from a file

```ts
import { fromFontFile, relativize } from "@adam-rocska/font-anatomy";

async function main() {
  const anatomy = await fromFontFile("path/to/font.ttf");
  if (!anatomy) throw new Error("Could not extract anatomy.");

  console.log(anatomy);
  console.log(relativize("unitsPerEm", anatomy));
}

await main();
```

### Read from a binary buffer

```ts
import { readFile } from "node:fs/promises";
import { fromFontBinary } from "@adam-rocska/font-anatomy";

const file = await readFile("path/to/font.woff2");
const anatomy = await fromFontBinary(file);

if (!anatomy) {
  throw new Error("Could not extract anatomy.");
}

console.log(anatomy.xHeight);
```

### Normalize metrics relatively

`relativize` turns an absolute anatomy into a relative one, usually against `unitsPerEm`:

```ts
import { relativize } from "@adam-rocska/font-anatomy";

const anatomy = {
  unitsPerEm: 1000,
  ascender: 800,
  descender: -200,
  xHeight: 500,
  capHeight: 700,
};

const relative = relativize("unitsPerEm", anatomy);

console.log(relative);
// {
//   unitsPerEm: 1,
//   ascender: 0.8,
//   descender: -0.2,
//   xHeight: 0.5,
//   capHeight: 0.7,
// }
```

You can also preserve your own numeric wrapper type by passing a converter:

```ts
import { relativize } from "@adam-rocska/font-anatomy";

class Points {
  constructor(private readonly value: number) {}
  valueOf() { return this.value; }
  static fromNumber(n: number) { return new Points(n); }
}

const anatomy = {
  unitsPerEm: new Points(1000),
  ascender: new Points(800),
  descender: new Points(-200),
  xHeight: new Points(500),
  capHeight: new Points(700),
};

const relative = relativize("unitsPerEm", anatomy, Points.fromNumber);
```

### Validate a candidate value

If you are reading anatomy data from JSON, caches, APIs, or other tools, `isFontAnatomy` gives you a dedicated type guard:

```ts
import { isFontAnatomy } from "@adam-rocska/font-anatomy";

const candidate: unknown = JSON.parse(someJsonString);

if (isFontAnatomy(candidate)) {
  console.log(candidate.capHeight);
}
```

It also supports custom value guards for wrapped numeric types.

## Behavior and Failure Model

If extraction fails, the library functions return `undefined` and write a message to `stderr`.

That means the package is easy to use in scripts and pipelines where you want:

- a narrow success type
- no giant custom error hierarchy
- human-readable diagnostics when parsing fails

The CLI exits with an error if:

- no input is provided
- the input is not a supported font binary
- the font cannot be parsed
- the font does not expose the expected OS/2 anatomy fields

## Reliability

This package is not just a thin wrapper around `opentype.js`.
It is backed by a large golden-output test corpus.

At the time of writing, the repository validates the CLI against:

- 615 specimen fonts
- 599 `.ttf` fixtures
- 16 `.woff2` fixtures
- JSON and Markdown output for every specimen

The corpus includes:

- static fonts
- variable fonts
- different families, weights, and styles
- very long real-world file names

There are also direct unit tests for relative normalization, including custom wrapped numeric values.

## When To Use It

This package is a good fit when you need to:

- compare vertical metrics across fonts
- build typographic tooling
- audit design-system font choices
- generate docs from font files
- normalize font metrics for layout work
- extract anatomy in scripts, CLIs, or build pipelines

It is probably not the right package if you need:

- glyph outline editing
- shaping
- text rendering
- subsetting
- a full font editor

## Example Markdown Output

The generated Markdown is designed to be readable in docs, issues, wikis, and generated reports.

It looks like this:

```md
# Poppins Bold Italic

Extracted using `font-anatomy`, a CLI utility of
[`@adam-rocska/font-anatomy`](https://github.com/adam-rocska/font-anatomy)

## Things to know

| Attribute      | Value |
| -------------- | ----- |
| Font Family    | Poppins |
| Font Subfamily | Bold Italic |
| Full Name      | Poppins Bold Italic |
| Version        | 4.004 |

## Anatomy

| Trait        | Absolute Value | Relative Value |
| ------------ | -------------- | -------------- |
| Units Per Em | 1000           | 1              |
| Ascender     | 1050           | 1.05           |
| Descender    | -350           | -0.35          |
| X-Height     | 558            | 0.558          |
| Cap Height   | 705            | 0.705          |
```

## License

MIT
