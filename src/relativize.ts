import {FontAnatomy} from "./font-anatomy";

export type Relativize = {
  (anatomy: FontAnatomy<number>, basedOn: keyof typeof anatomy): FontAnatomy<number>;
  <Value extends Number>(
    anatomy: FontAnatomy<Value>,
    basedOn: keyof typeof anatomy,
    numberToValue: (n: number) => Value
  ): FontAnatomy<Value>;
};

export const relativize: Relativize = (
  anatomy: FontAnatomy<any>,
  basedOn: keyof typeof anatomy,
  numberToValue: (n: number) => any = n => n
) => ({
  unitsPerEm: numberToValue(anatomy.unitsPerEm / anatomy[basedOn]),
  ascender: numberToValue(anatomy.ascender / anatomy[basedOn]),
  descender: numberToValue(anatomy.descender / anatomy[basedOn]),
  xHeight: numberToValue(anatomy.xHeight / anatomy[basedOn]),
  capHeight: numberToValue(anatomy.capHeight / anatomy[basedOn]),
});