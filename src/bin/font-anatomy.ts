import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';
import openType, {Font, LocalizedName} from 'opentype.js';
import {fromFont} from '../from-font';
import {relativize} from '../relativize';
import packageJson from '../../package.json';
import {markdownTable} from "@adam-rocska/markdown-table";

yargs(hideBin(process.argv))
  .version(packageJson.version)
  .showHelpOnFail(true)
  .option(`outputFormat`, {alias: `o`, choices: [`json`, `md`], default: `json`})
  .option('headingLevel', {alias: 'h', type: 'number', default: 1})
  .parseAsync()
  .then(async (argv) => {
    const input = await process
      .stdin
      .reduce(
        (i, c) => Buffer.concat([i, c]),
        Buffer.alloc(0)
      );

    if (!input.length) throw new Error('No input received.');
    const font = openType.parse(input.buffer);
    const anatomy = fromFont(font);
    if (!anatomy) throw new Error('Could not extract anatomy.');

    if (argv.outputFormat === 'json') return process.stdout.write(JSON.stringify(anatomy));
    if (argv.headingLevel < 1 || argv.headingLevel > 5) throw new Error('Invalid heading level.');

    const relativized = relativize("unitsPerEm", anatomy);

    process.stdout.write([
      head(argv.headingLevel, resolveLocalizedName(font.names.fullName)),
      '',
      'Extracted using `font-anatomy`, a CLI utility of',
      '[`@adam-rocska/font-anatomy`](https://github.com/adam-rocska/font-anatomy)',
      '',
      head(argv.headingLevel + 1, 'Things to know'),
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
      head(argv.headingLevel + 1, 'Anatomy'),
      '',
      markdownTable(
        [`Trait`, `Absolute Value`, `Relative Value`],
        [`Units Per Em`, `${anatomy.unitsPerEm}`, `${relativized.unitsPerEm}`],
        [`Ascender`, `${anatomy.ascender}`, `${relativized.ascender}`],
        [`Descender`, `${anatomy.descender}`, `${relativized.descender}`],
        [`X-Height`, `${anatomy.xHeight}`, `${relativized.xHeight}`],
        [`Cap Height`, `${anatomy.capHeight}`, `${relativized.capHeight}`]
      ),
      ''
    ].join('\n'));
  });

function head(level: number, text: string): string {return `${'#'.repeat(level)} ${text}`;}

function resolveLocalizedName(localizedName: LocalizedName): string {
  if (!localizedName) return '';
  const key = Object.keys(localizedName).find(k => /^en(\W|$)/.test(k));
  const value = key
    ? localizedName[key]
    : Object.values(localizedName)[0];
  return value ?? '';
}