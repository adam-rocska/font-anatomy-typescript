import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';
import {cwd} from 'node:process';
import openType, {LocalizedName} from 'opentype.js';
import {fromFont} from '../from-font';
import {FixedLengthArray} from "type-fest";
import {relativize} from '../relativize';
import packageJson from '../../package.json';

enum ExitCode {
  Success = 0,
  LoadError = 1,
  ExtractError = 2
}

(async () => {
  const argv = await yargs(hideBin(process.argv))
    .version(packageJson.version)
    .showHelpOnFail(true)
    .option(`outputFormat`, {
      alias: `o`,
      describe: `The format of the output.`,
      type: `string`,
      choices: [`json`, `md`],
      default: `json`
    })
    .parseAsync();

  const input: Buffer = await process.stdin.reduce((a, b) => a + b);

  const path = optionalTry(() => new URL(input.toString()))
    ?? optionalTry(() => new URL(input.toString(), cwd()))
    ?? optionalTry(() => new URL(input.toString(), '/'));
  const font = path
    ? await optionalTry(() => openType.load(path.toString()))
    : optionalTry(() => openType.parse(input
      .buffer
      .slice(input.byteOffset, input.byteOffset + input.byteLength))
    );

  if (!font) {
    process.stderr.write(`Could not load font.\n`);
    process.exit(ExitCode.LoadError);
  }

  const anatomy = fromFont(font);
  if (!anatomy) {
    process.stderr.write(`Could not extract anatomy.\n`);
    process.exit(ExitCode.ExtractError);
  }

  if (argv.outputFormat === 'json') {
    process.stdout.write(JSON.stringify(anatomy));
  } else if (argv.outputFormat === 'md') {
    const relativized = relativize(anatomy, "unitsPerEm");
    process.stdout.write([
      `# ${resolveLocalizedName(font.names.fullName)}`,
      '',
      '## Things to know',
      '',
      markdownTable(
        ["Attribute", "Value"],
        ["Copyright", resolveLocalizedName(font.names.copyright)],
        ["Description", resolveLocalizedName(font.names.description)],
        ["Designer", resolveLocalizedName(font.names.designer)],
        ["Designer URL", resolveLocalizedName(font.names.designerURL)],
        ["Font Family", resolveLocalizedName(font.names.fontFamily)],
        ["Font Subfamily", resolveLocalizedName(font.names.fontSubfamily)],
        ["Full Name", resolveLocalizedName(font.names.fullName)],
        ["License", resolveLocalizedName(font.names.license)],
        ["License URL", resolveLocalizedName(font.names.licenseURL)],
        ["Manufacturer", resolveLocalizedName(font.names.manufacturer)],
        ["Manufacturer URL", resolveLocalizedName(font.names.manufacturerURL)],
        ["postScript Name", resolveLocalizedName(font.names.postScriptName)],
        ["Trademark", resolveLocalizedName(font.names.trademark)],
        ["Version", resolveLocalizedName(font.names.version)],
      ),
      '',
      '## Anatomy',
      '',
      markdownTable(
        [`Trait`, `Absolute Value`, `Relative Value`],
        [`Units Per Em`, `${anatomy.unitsPerEm}`, `${relativized.unitsPerEm}`],
        [`Ascender`, `${anatomy.ascender}`, `${relativized.ascender}`],
        [`Descender`, `${anatomy.descender}`, `${relativized.descender}`],
        [`X-Height`, `${anatomy.xHeight}`, `${relativized.xHeight}`],
        [`Cap Height`, `${anatomy.capHeight}`, `${relativized.capHeight}`]
      )
    ].join('\n'));
  }
})();

function optionalTry<T>(f: () => T): T | void {
  const logFailure = (e: unknown) => {
    if (process.env.NODE_ENV !== 'development') return;
    process.stderr.write(`Error: ${e}\n`);
  };
  try {
    const result = f();
    if (result instanceof Promise) result.catch(logFailure);
    return result;
  }
  catch (error) {logFailure(error);}
}

function markdownTable<
  Headers extends FixedLengthArray<string, number>
>(
  headers: Headers,
  ...rows: FixedLengthArray<string, Headers["length"]>[]
): string {
  const longestLengthPerColumn = [headers, ...rows]
    .reduce(
      (t, r) => t.map((v, i) => Math.max(v, r[i].length)),
      headers.map(() => 0)
    );

  const pad = (content: string, columnIndex: number): string => content
    .trim()
    .padEnd(longestLengthPerColumn[columnIndex]);

  return [
    headers.map(pad).join(' | '),
    headers.map((_, i) => pad('', i).replace(/ /g, '-')).join(' | '),
    ...rows.map(row => row.map(pad).join(' | '))
  ]
    .map(r => `| ${r} |`)
    .join('\n')
    .concat('\n\n');
}

function resolveLocalizedName(localizedName: LocalizedName): string {
  if (!localizedName) return '';
  const key = Object.keys(localizedName).find(k => /^en(\W|$)}/.test(k));
  const value = key
    ? localizedName[key]
    : Object.values(localizedName)[0];
  return value ?? '';
}