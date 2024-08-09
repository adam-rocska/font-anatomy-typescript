# 1.0.0

Initial release.
Enjoy.

## Features

### relativize

Utility for when you need a font anatomy object who's values
are relative to one of its properties.

```ts
import { relativize } from '@adam-rocska/font-anatomy';

relativize('unitsPerEm', {
  unitsPerEm: 1000,
  ascender: 800,
  descender: -200,
  xHeight: 500,
  capHeight: 700
});
```

will yield

```json
{
  unitsPerEm: 1,
  ascender: 0.8,
  descender: -0.2,
  xHeight: 0.5,
  capHeight: 0.7,
}
```
