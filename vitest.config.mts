import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const projectRoot = fileURLToPath(new URL("./", import.meta.url));

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^!(.*)$/,
        replacement: `${projectRoot}$1`,
      },
      {
        find: "@adam-rocska/font-anatomy",
        replacement: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
      },
    ],
  },
  test: {
    environment: "node",
    hookTimeout: 60_000,
    include: ["test/**/*.test.ts"],
    testTimeout: 10_000,
    coverage: {
      include: ["src/**/*.ts"],
      provider: "v8",
    },
  },
});
