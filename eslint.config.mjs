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
    files: ["bin/**/*.mjs", "eslint.config.mjs", "vitest.config.mts"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: nodeGlobals,
    },
    rules,
  },
];
