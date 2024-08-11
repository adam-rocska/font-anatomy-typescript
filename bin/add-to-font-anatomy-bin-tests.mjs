#!/usr/bin/env node

import {spawnSync} from "child_process";
import {copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, unlinkSync, writeFileSync} from "fs";
import {extname, resolve, sep} from "path";
import {fileURLToPath} from "url";

const __dirname = fileURLToPath(import.meta.url);
const extensions = [".ttf", ".otf", ".woff", ".woff2"];
const specimenDirectory = resolve(__dirname, "../../test/bin/font-anatomy/user/specimen/");

const config = {
  skipFailure: false,
  skipOverwrite: false,
};

process
  .argv
  .slice(2)
  .map(arg => {
    const set = flag => {config[flag] = true; return undefined;};
    if (arg === "-sf") return set("skipFailure");
    if (arg === "-so") return set("skipOverwrite");
    return arg;
  })
  .filter(arg => arg !== undefined)
  .map(s => resolve(s))
  .reduce(resolveFontFiles, [])
  .filter((f, i, a) => a.indexOf(f) === i)
  .forEach(source => {
    const sourceName = fileName(source);
    const specimen = resolve(specimenDirectory, sourceName.withExtension);
    const font = resolve(specimen, sourceName.withExtension);
    const json = resolve(specimen, `${sourceName.withoutExtension}.json`);
    const md = resolve(specimen, `${sourceName.withoutExtension}.md`);

    if (!existsSync(specimen)) mkdirSync(specimen, {recursive: true});

    if (existsSync(font) && !config.skipOverwrite) unlinkSync(font);
    if (existsSync(json) && !config.skipOverwrite) unlinkSync(json);
    if (existsSync(md) && !config.skipOverwrite) unlinkSync(md);

    try {
      if (!existsSync(font) || !config.skipOverwrite) copyFileSync(source, font);
      if (!existsSync(json) || !config.skipOverwrite) createSpecimen(font, json, 'json');
      if (!existsSync(md) || !config.skipOverwrite) createSpecimen(font, md, 'md');
    } catch (error) {
      if (config.skipFailure) return process.stdout.write('F');
      throw error;
    }

    process.stdout.write('.');
  });

function fileName(path) {
  const withExtension = path.split(sep).pop();
  const withoutExtension = withExtension.split(".").slice(0, -1).join(".");
  return {withExtension, withoutExtension};
}

/**
 * @param {string} input
 * @param {string} output
 * @param {"json"|"md"} format
 */
function createSpecimen(input, output, format) {
  const process = spawnSync(
    "pnpm",
    ["font-anatomy", "-o", format],
    {
      encoding: "binary",
      stdio: ['pipe', 'pipe', 'inherit'],
      input: readFileSync(input, {encoding: "binary"}),
    }
  );
  writeFileSync(output, Buffer.from(process.stdout, "binary"));
  if (process.status !== 0) throw new Error(process.stderr);
}

/**
 * @param {Array<string>} into
 * @param {string} from
 * @returns {Array<string>}
 */
function resolveFontFiles(into, from) {
  const s = statSync(from);
  if (s.isDirectory()) return readdirSync(from)
    .map(file => resolve(from, file))
    .reduce(resolveFontFiles, into);
  if (!s.isFile()) return into;
  if (!extensions.includes(extname(from))) return into;
  return [...into, from];
}