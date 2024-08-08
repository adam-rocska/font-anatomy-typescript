import {Font} from "opentype.js";
import {FontAnatomy} from "./font-anatomy";

/**
 * Represents the anatomy of the given `Font`.
 * @param {Font} font
 * @returns {FontAnatomy<number> | void} Returns void if the font is not valid.
 */
export function fromFont(font: Font): FontAnatomy<number> | void {
  if (!(`tables` in font)) return console.error(`Has no tables`);
  if (!(`os2` in font.tables)) return console.error(`Has no os2`);
  if (!(`sxHeight` in font.tables[`os2`])) return console.error(`Has no sxHeight`);
  if (!(`sCapHeight` in font.tables[`os2`])) return console.error(`Has no sCapHeight`);

  return {
    unitsPerEm: font.unitsPerEm,
    ascender: font.ascender,
    descender: font.descender,
    xHeight: font.tables[`os2`].sxHeight,
    capHeight: font.tables[`os2`].sCapHeight
  };
}