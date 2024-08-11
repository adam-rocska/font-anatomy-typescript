import {PathLike} from "fs";
import {FontAnatomy} from "./font-anatomy";
import {readFile} from "fs/promises";
import {fromFontBinary} from "./from-font-binary";
import {error} from "./error";

export async function fromFontFile(
  path: PathLike
): Promise<FontAnatomy<number> | undefined> {
  try {
    return fromFontBinary(await readFile(path)) ?? error(`Could not extract anatomy.`);
  } catch (e) {
    error(`Failed to load the given file.`, path, e);
  }
}