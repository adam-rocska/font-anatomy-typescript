import {ExpressibleAsNumber} from "./expressible-as-number";
import {FontAnatomy} from "./font-anatomy";

export function relativize<
  Value extends ExpressibleAsNumber = number
>(
  anatomy: FontAnatomy<Value>,
  basedOn: keyof typeof anatomy,
  numberToValue: (n: number) => Value
): FontAnatomy<Value>;
export function relativize(
  anatomy: FontAnatomy<number>,
  basedOn: keyof typeof anatomy
): FontAnatomy<number>;
export function relativize(
  anatomy: FontAnatomy<any>,
  basedOn: keyof typeof anatomy,
  numberToValue: (n: any) => any = n => n
): FontAnatomy<any> {
  return ({
    unitsPerEm: numberToValue(anatomy.unitsPerEm.valueOf() / anatomy[basedOn].valueOf()),
    ascender: numberToValue(anatomy.ascender.valueOf() / anatomy[basedOn].valueOf()),
    descender: numberToValue(anatomy.descender.valueOf() / anatomy[basedOn].valueOf()),
    xHeight: numberToValue(anatomy.xHeight.valueOf() / anatomy[basedOn].valueOf()),
    capHeight: numberToValue(anatomy.capHeight.valueOf() / anatomy[basedOn].valueOf()),
  });
}