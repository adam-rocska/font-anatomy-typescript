#!/usr/bin/env node

import {exec, execSync, spawn} from "child_process";
import {createReadStream, createWriteStream, existsSync} from "fs";
import {copyFile, mkdir, readFile, writeFile, stat, readdir} from "fs/promises";
import {extname, resolve, sep} from "path";
import {fileURLToPath} from "url";

const __dirname = fileURLToPath(import.meta.url);
const extensions = [".ttf", ".otf", ".woff", ".woff2"];
const specimenDirectory = resolve(__dirname, "../../test/bin/font-anatomy/user/specimen/");

await
  process
    .argv
    .slice(2)
    .map(s => resolve(s))
    .reduce(resolveFontFiles, Promise.resolve([]))
    .then(async files => Promise.all(
      files
        .filter((f, i, a) => a.indexOf(f) === i)
        .map(async font => {
          const fontFileName = font.split(sep).pop();
          const specimenName = fontFileName.split(".").slice(0, -1).join(".");
          const specimenPath = resolve(specimenDirectory, specimenName);

          if (!existsSync(specimenPath)) await mkdir(specimenPath, {recursive: true});

          /// NOTE: stdout Status markers are alchemical symbols, not astro bs.
          process.stdout.write(`♋︎`); // 🜚 : Solution
          await Promise.all([
            copyFile(font, resolve(specimenPath, fontFileName))
              .then(() => process.stdout.write('♒︎')), // ♒︎ : Multiplication
            expectedOutputOf(font, 'json')
              .then(() => process.stdout.write('♌︎')), // ♌︎ : Digestion
            expectedOutputOf(font, 'md')
              .then(() => process.stdout.write('♓︎')) // ♓︎ : Projection
          ]);
        })
    ));

function expectedOutputOf(font, format) {
  return new Promise((resolve, reject) => {
    const fontFileName = font.split(sep).pop();
    const specimenName = fontFileName.split(".").slice(0, -1).join(".");
    const specimenPath = resolve(specimenDirectory, specimenName);
    /** @type {SpawnOptions} */
    const spawnParams = {stdio: ['pipe', 'inherit', 'inherit']};
    const process = spawn('pnpm', ['font-anatomy', '-o', format], spawnParams);
    process.pipe(createReadStream(fontCopyPath));
    process.pipe(createWriteStream(resolve(specimenPath, `${specimenName}.${format}`)));
    process.on('exit', resolve);
    process.on('error', reject);
  });
}

/**
 * @param {Promise<Array<string>>} into
 * @param {string} from
 * @returns {Promise<Array<string>>}
 */
async function resolveFontFiles(into, from) {
  const fromStat = await stat(from);
  if (fromStat.isDirectory()) return (await readdir(from))
    .map(file => resolve(from, file))
    .reduce(resolveFontFiles, into);
  if (!fromStat.isFile()) return into;
  if (!extensions.includes(extname(from))) return into;
  return into.then(files => [...files, from]);
}