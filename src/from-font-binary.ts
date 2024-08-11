import {parse} from "opentype.js";
import {FontAnatomy} from "./font-anatomy";
import {fromFont} from "./from-font";
import wawoff2 from "wawoff2";
import {error} from "./error";

export async function fromFontBinary(
  file: Buffer
): Promise<FontAnatomy<number> | undefined> {
  if (!isFont(file)) return error(`The given file is not a font.`);
  try {
    if (isWOFF2(file)) file = Buffer.from(await wawoff2.decompress(file));
    const font = parse(file.buffer);
    return fromFont(font);
  } catch (e) {
    error(`Failed to parse the given file.`, e);
  }
}

function isFont(buffer: Buffer): boolean {
  const header = buffer.subarray(0, 4);
  const isTTF = header.equals(Buffer.from([0x00, 0x01, 0x00, 0x00]));
  const isOTF = header.equals(Buffer.from([0x4F, 0x54, 0x54, 0x4F]));
  const isWOFF2 = header.equals(Buffer.from([0x77, 0x4F, 0x46, 0x32]));

  return isTTF || isOTF || isWOFF2;
}

function isWOFF2(buffer: Buffer): boolean {
  return buffer.slice(0, 4).equals(Buffer.from([0x77, 0x4F, 0x46, 0x32]));
}