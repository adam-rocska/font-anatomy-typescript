import {Font} from "opentype.js";
import {FontAnatomy} from "./font-anatomy";
import {error} from "./error";
import {FontAnatomyInstance} from "./font-anatomy-instance";

/**
 * Represents the anatomy of the given `Font`.
 * @param {Font} font
 * @returns {FontAnatomy<number> | undefined} Returns undefined if the font is not valid.
 */
export function fromFont(font: Font): FontAnatomy<number> | undefined {
  if (!(`tables` in font)) return error(`Has no tables`);
  if (!(`os2` in font.tables)) return error(`Has no os2`);
  if (!(`sxHeight` in font.tables[`os2`])) return error(`Has no sxHeight`);
  if (!(`sCapHeight` in font.tables[`os2`])) return error(`Has no sCapHeight`);

  return FontAnatomyInstance.fromLiteral({
    font,
    unitsPerEm: font.unitsPerEm,
    ascender: font.ascender,
    descender: font.descender,
    xHeight: font.tables[`os2`].sxHeight,
    capHeight: font.tables[`os2`].sCapHeight
  });
}