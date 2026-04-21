import tsParser from "@typescript-eslint/parser";

const rules = {
  semi: ["error", "always"],
  "prefer-const": "error",
  "no-restricted-imports": [
    "error",
    {
      name: "next/link",
      message: "Please import from `@/navigation` instead.",
    },
    {
      name: "next/navigation",
      importNames: ["redirect", "permanentRedirect", "useRouter", "usePathname"],
      message: "Please import from `@/navigation` instead.",
    },
  ],
};

const nodeGlobals = {
  Buffer: "readonly",
  __dirname: "readonly",
  __filename: "readonly",
  console: "readonly",
  global: "readonly",
  module: "readonly",
  process: "readonly",
  require: "readonly",
  setTimeout: "readonly",
  clearTimeout: "readonly",
};

const jestGlobals = {
  afterAll: "readonly",
  afterEach: "readonly",
  beforeAll: "readonly",
  beforeEach: "readonly",
  describe: "readonly",
  expect: "readonly",
  it: "readonly",
  jest: "readonly",
  test: "readonly",
};

export default [
  {
    ignores: ["coverage/**", "dist/**", "node_modules/**"],
  },
  {
    files: ["src/**/*.ts", "test/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: nodeGlobals,
    },
    rules,
  },
  {
    files: ["test/**/*.ts"],
    languageOptions: {
      globals: {
        ...nodeGlobals,
        ...jestGlobals,
      },
    },
  },
  {
    files: ["bin/**/*.mjs", "eslint.config.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: nodeGlobals,
    },
    rules,
  },
];
