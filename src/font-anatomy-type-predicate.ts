import {Font} from "opentype.js";
import {FontAnatomy} from "./font-anatomy";
import {FontAnatomyInstance} from "./font-anatomy-instance";
import {ExpressibleAsNumber} from "./expressible-as-number";

export const isFontAnatomy: FontAnatomyTypePredicate = (
  candidate: any,
  isValue: (v: any) => v is number = v => typeof v === 'number'
): candidate is FontAnatomy<number> => {
  if (typeof candidate !== `object` || candidate === null) return false;

  if (candidate instanceof FontAnatomyInstance) return true;

  if (`unitsPerEm` in candidate === false) return false;
  if (`ascender` in candidate === false) return false;
  if (`descender` in candidate === false) return false;
  if (`xHeight` in candidate === false) return false;
  if (`capHeight` in candidate === false) return false;

  if (!isValue(candidate.unitsPerEm)) return false;
  if (!isValue(candidate.ascender)) return false;
  if (!isValue(candidate.descender)) return false;
  if (!isValue(candidate.xHeight)) return false;
  if (!isValue(candidate.capHeight)) return false;

  if (`font` in candidate && !(candidate.font instanceof Font)) return false;

  return true;
};


export type FontAnatomyTypePredicate = {
  (candidate: any): candidate is FontAnatomy<number>;
  <Value extends ExpressibleAsNumber>(
    candidate: any,
    isValue: (valueCandidate: any) => valueCandidate is Value
  ): candidate is FontAnatomy<Value>;
};
