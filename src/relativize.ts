import {ExpressibleAsNumber} from "./expressible-as-number";
import {FontAnatomy} from "./font-anatomy";

export function relativize<
  Value extends ExpressibleAsNumber = number
>(
  basedOn: keyof typeof anatomy,
  anatomy: FontAnatomy<Value>,
  numberToValue: (n: number) => Value
): FontAnatomy<Value>;
export function relativize(
  basedOn: keyof typeof anatomy,
  anatomy: FontAnatomy<number>
): FontAnatomy<number>;
export function relativize(
  basedOn: keyof typeof anatomy,
  anatomy: FontAnatomy<any>,
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