export type FontAnatomy<Value extends Number> = {
  unitsPerEm: Value,
  ascender: Value,
  descender: Value,
  xHeight: Value,
  capHeight: Value
};

export const isFontAnatomy: FontAnatomyTypePredicate = (
  candidate: any,
  isValue: (v: any) => v is number = v => typeof v === 'number'
): candidate is FontAnatomy<number> => {
  if (typeof candidate !== `object` || candidate === null) return false;

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

  return true;
};

export type FontAnatomyTypePredicate = {
  (candidate: any): candidate is FontAnatomy<number>;
  <Value extends Number>(
    candidate: any,
    isValue: (valueCandidate: any) => valueCandidate is Value
  ): candidate is FontAnatomy<Value>;
};
