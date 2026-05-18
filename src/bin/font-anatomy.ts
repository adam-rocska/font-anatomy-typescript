import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';
import {fromFont} from '../from-font';
import {relativize} from '../relativize';
import packageJson from '../../package.json';
import {markdownTable} from "@adam-rocska/markdown-table";
import {fromFontBinary} from '../from-font-binary';
import {resolveFontName} from './resolve-font-name';

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
    const anatomy = await fromFontBinary(input);
    if (!anatomy) throw new Error('Could not extract anatomy.');
    if (!anatomy.font) throw new Error('Could not extract font.');
    const font = anatomy.font;

    if (argv.outputFormat === 'json') return process.stdout.write(JSON.stringify(anatomy));
    if (argv.headingLevel < 1 || argv.headingLevel > 5) throw new Error('Invalid heading level.');

    const relativized = relativize("unitsPerEm", anatomy);

    process.stdout.write([
      head(argv.headingLevel, resolveFontName(font.names, "fullName")),
      '',
      'Extracted using `font-anatomy`, a CLI utility of',
      '[`@adam-rocska/font-anatomy`](https://github.com/adam-rocska/font-anatomy)',
      '',
      head(argv.headingLevel + 1, 'Things to know'),
      '',
      markdownTable(
        ["Attribute", "Value"],
        ["Copyright", resolveFontName(font.names, "copyright")],
        ["Description", resolveFontName(font.names, "description")],
        ["Designer", resolveFontName(font.names, "designer")],
        ["Designer URL", resolveFontName(font.names, "designerURL")],
        ["Font Family", resolveFontName(font.names, "fontFamily")],
        ["Font Subfamily", resolveFontName(font.names, "fontSubfamily")],
        ["Full Name", resolveFontName(font.names, "fullName")],
        ["License", resolveFontName(font.names, "license")],
        ["License URL", resolveFontName(font.names, "licenseURL")],
        ["Manufacturer", resolveFontName(font.names, "manufacturer")],
        ["Manufacturer URL", resolveFontName(font.names, "manufacturerURL")],
        ["postScript Name", resolveFontName(font.names, "postScriptName")],
        ["Trademark", resolveFontName(font.names, "trademark")],
        ["Version", resolveFontName(font.names, "version")],
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
