import {PathLike} from "fs";
import {load} from "opentype.js";
import {FontAnatomy} from "./font-anatomy";
import {fromFont} from "./from-font";


export async function fromFontFile(
  path: PathLike
): Promise<FontAnatomy<number> | void> {
  try {
    return fromFont(await load(path.toString()));
  } catch (error) {
    console.error(`OpenType.JS failed to load the given file.`, path, error);
  }
}