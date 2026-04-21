import { spawnSync } from "child_process";
import { closeSync, existsSync, openSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "fs";
import { mkdir } from "fs/promises";
import { dirname, resolve } from "path";
import { setTimeout as delay } from "timers/promises";
import { fileURLToPath } from "url";
import { beforeAll, describe, expect, it } from "vitest";

const SHARD_COUNT = 8;
const currentDirectory = fileURLToPath(new URL(".", import.meta.url));
const projectRoot = resolve(currentDirectory, "../../../../");
const cliEntrypoint = resolve(projectRoot, "dist/bin/font-anatomy.js");
const buildLock = resolve(projectRoot, ".vitest", "font-anatomy-build.lock");
const buildInputs = [
  resolve(projectRoot, "package.json"),
  resolve(projectRoot, "tsconfig.json"),
  ...collectFiles(resolve(projectRoot, "src")),
];

const replaceExtension = (name: string, ext: string) => name.split(".").slice(0, -1).join(".") + ext;
const specimen = readdirSync(resolve(currentDirectory, "specimen"))
  .sort((left, right) => left.localeCompare(right))
  .map(name => ({
    name: name,
    font: resolve(currentDirectory, "specimen", `${name}`, name),
    json: resolve(currentDirectory, "specimen", `${name}`, replaceExtension(name, ".json")),
    md: resolve(currentDirectory, "specimen", `${name}`, replaceExtension(name, ".md")),
  }));

export function registerFontAnatomyShardTests(shardIndex: number): void {
  const shardSpecimen = specimen.filter((_, index) => index % SHARD_COUNT === shardIndex);

  describe(`$ font-anatomy [shard ${shardIndex + 1}/${SHARD_COUNT}]`, () => {
    beforeAll(async () => {
      await ensureCliBuilt();
    });

    if (shardIndex === 0) {
      it("should fail when no input is provided", () => {
        const process = runCli();
        expect(process.status).not.toBe(0);
        expect(process.stderr.toString()).toContain("No input received.");
      });
    }

    describe.each(shardSpecimen)("when provided a valid input", specimen => {
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
}

function outputOf(input: Buffer, ...args: string[]): Buffer {
  const process = runCli(input, ...args);
  if (process.status !== 0) throw new Error(process.stderr.toString() || "The CLI exited with an error.");
  return process.stdout;
}

function runCli(input?: Buffer, ...args: string[]) {
  return spawnSync(process.execPath, [cliEntrypoint, ...args], {
    cwd: projectRoot,
    input,
    stdio: ["pipe", "pipe", "pipe"],
  });
}

async function ensureCliBuilt(): Promise<void> {
  if (isBuildFresh()) return;

  await mkdir(dirname(buildLock), { recursive: true });

  while (true) {
    if (isBuildFresh()) return;

    const lock = tryAcquireBuildLock();
    if (lock !== null) {
      try {
        writeFileSync(buildLock, `${process.pid}`);
        const buildProcess = spawnSync("pnpm", ["build"], {
          cwd: projectRoot,
          stdio: "inherit",
        });
        if (buildProcess.status !== 0) throw new Error("Could not build the CLI.");
      } finally {
        closeSync(lock);
        rmSync(buildLock, { force: true });
      }

      if (!isBuildFresh()) throw new Error("The CLI build completed without producing a fresh artifact.");
      return;
    }

    clearStaleBuildLock();
    await delay(50);
  }
}

function tryAcquireBuildLock(): number | null {
  try {
    return openSync(buildLock, "wx");
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "EEXIST") return null;
    throw error;
  }
}

function clearStaleBuildLock(): void {
  if (!existsSync(buildLock)) return;

  const owner = Number.parseInt(readFileSync(buildLock, "utf8"), 10);
  if (Number.isNaN(owner)) return;
  if (isRunning(owner)) return;

  rmSync(buildLock, { force: true });
}

function isBuildFresh(): boolean {
  if (!existsSync(cliEntrypoint)) return false;

  const builtAt = statSync(cliEntrypoint).mtimeMs;
  const latestInput = buildInputs.reduce(
    (latest, file) => Math.max(latest, statSync(file).mtimeMs),
    0
  );

  return builtAt >= latestInput;
}

function isRunning(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    if (typeof error === "object" && error && "code" in error) {
      if (error.code === "ESRCH") return false;
      if (error.code === "EPERM") return true;
    }
    throw error;
  }
}

function collectFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return collectFiles(path);
    return [path];
  });
}
