# 1.1.4

## Patch Changes

- No API changes. This release is a housekeeping and modernization pass.
- Upgraded linting to ESLint `10.2.1` and migrated from legacy `.eslintrc` config to the modern flat config format while preserving the same project-specific lint constraints.
- Migrated the test suite from Jest to Vitest `4.1.5`, kept the same corpus and assertions, and split the CLI golden tests into parallel shards to improve runtime without dropping coverage.
- Added dedicated `typecheck`, `test:watch`, and `test:coverage` scripts and tightened the `check` pipeline.
- Upgraded the core toolchain and metadata to current stable versions, including pnpm `10.33.0`, bunchee `6.10.0`, TypeScript `6.0.3`, and Node type definitions for the current LTS line.
- Modernized CI and release automation with a separate everyday CI workflow, a Node `20`/`22`/`24` verification matrix, and trusted-publishing-ready npm release configuration.
- Refreshed the README and examples to match the real async API, current pnpm usage, supported formats, and actual CLI output shape.
- Improved package metadata for discoverability by tightening the npm description, keywords, homepage, and related release housekeeping.
