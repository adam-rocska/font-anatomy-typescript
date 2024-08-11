import {Font} from "opentype.js";
import {ExpressibleAsNumber} from "./expressible-as-number";

export type FontAnatomy<Value extends ExpressibleAsNumber> = {
  font?: Font,
  unitsPerEm: Value,
  ascender: Value,
  descender: Value,
  xHeight: Value,
  capHeight: Value
};
