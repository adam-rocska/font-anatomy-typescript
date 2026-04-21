import {spawnSync} from "child_process";
import {readdirSync, readFileSync} from "fs";
import {resolve} from "path";
import {fileURLToPath} from "url";
import {beforeAll, describe, expect, it} from "vitest";

const replaceExtension = (name: string, ext: string) => name.split(".").slice(0, -1).join(".") + ext;
const currentDirectory = fileURLToPath(new URL(".", import.meta.url));
const projectRoot = resolve(currentDirectory, "../../../../");
const cliEntrypoint = resolve(projectRoot, "dist/bin/font-anatomy.js");
const specimen = readdirSync(resolve(currentDirectory, "specimen"))
  .map(name => ({
    name: name,
    font: resolve(currentDirectory, "specimen", `${name}`, name),
    json: resolve(currentDirectory, "specimen", `${name}`, replaceExtension(name, ".json")),
    md: resolve(currentDirectory, "specimen", `${name}`, replaceExtension(name, ".md")),
  }));

describe("$ font-anatomy", () => {
  beforeAll(() => {
    const process = spawnSync("pnpm", ["build"], {
      cwd: projectRoot,
      stdio: "inherit",
    });
    if (process.status !== 0) throw new Error("Could not build the CLI.");
  });

  it("should fail when no input is provided", () => {
    const process = runCli();
    expect(process.status).not.toBe(0);
    expect(process.stderr.toString()).toContain("No input received.");
  });

  describe.each(specimen)("when provided a valid input", specimen => {
    it("should yield a json by default.", () => {
      const actual = outputOf(readFileSync(specimen.font));
      const expected = readFileSync(specimen.json);
      expect(actual.toString()).toEqual(expected.toString());
    });

    it("should yield an md when explicitly stated.", () => {
      const actual = outputOf(readFileSync(specimen.font), "--output-format=md");
      const expected = readFileSync(specimen.md);
      expect(actual.toString()).toEqual(expected.toString());
    });

    it("should yield a json when explicitly stated.", () => {
      const actual = outputOf(readFileSync(specimen.font), "--output-format=json");
      const expected = readFileSync(specimen.json);
      expect(actual.toString()).toEqual(expected.toString());
    });
  });
});

function outputOf(input: Buffer, ...args: string[]): Buffer {
  const process = runCli(input, ...args);
  if (process.status !== 0) throw new Error(process.stderr.toString() || "The CLI exited with an error.");
  return process.stdout;
}

function runCli(input?: Buffer, ...args: string[]) {
  return spawnSync(process.execPath, [cliEntrypoint, ...args], {
    cwd: projectRoot,
    input,
    stdio: ['pipe', 'pipe', 'pipe'],
  });
}
