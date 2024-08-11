# 1.1.0

A handful of features.

## Minor Changes

* Added `fromFontBinary` to support font anatomy creation
  directly from binary data.
* Added a `FontAnatomyInstance` utility class to help with
  font anatomy JSON stringification when it has a `Font`
  instance associated with it. This was necessary to simplify
  the JSON stringification process, because `OpenType.JS` has
  a circular reference in its `Font` class, which causes
  `JSON.stringify` to fail.
* Added **wOF2** support.
* Added an optional `font` field to the `FontAnatomy` type,
  for the cases when it is known, it can be carried around
  with the anatomy.
* Exposed `ExpressibleAsNumber` to help with the
  implementations of more complex use cases.

## Patch Changes

* Occasionally to use `void` type instead of `undefined`
  which messed around with TypeScript conventions. They
  practically are the same (sadly) in this stack, but hey,
  play along. Now they're all `undefined`.
* Added some more keywords, dunno if it matters though.
