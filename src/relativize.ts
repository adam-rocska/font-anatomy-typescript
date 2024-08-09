import {ExpressibleAsNumber} from "./expressible-as-number";
import {FontAnatomy} from "./font-anatomy";

export type Relativize = {
  (anatomy: FontAnatomy<number>, basedOn: keyof typeof anatomy): FontAnatomy<number>;
  <Value extends ExpressibleAsNumber>(
    anatomy: FontAnatomy<Value>,
    basedOn: keyof typeof anatomy,
    numberToValue: (n: number) => Value
  ): FontAnatomy<Value>;
};

export const relativize: Relativize = <
  Value extends ExpressibleAsNumber = number
>(
  anatomy: FontAnatomy<Value>,
  basedOn: keyof typeof anatomy,
  numberToValue: (n: number) => Value = n => n
): FontAnatomy<Value> => ({
  unitsPerEm: numberToValue(anatomy.unitsPerEm.valueOf() / anatomy[basedOn].valueOf()),
  ascender: numberToValue(anatomy.ascender.valueOf() / anatomy[basedOn].valueOf()),
  descender: numberToValue(anatomy.descender.valueOf() / anatomy[basedOn].valueOf()),
  xHeight: numberToValue(anatomy.xHeight.valueOf() / anatomy[basedOn].valueOf()),
  capHeight: numberToValue(anatomy.capHeight.valueOf() / anatomy[basedOn].valueOf()),
});