import {Font} from "opentype.js";
import {ExpressibleAsNumber} from "./expressible-as-number";
import {FontAnatomy} from "./font-anatomy";

export class FontAnatomyInstance<Value extends ExpressibleAsNumber> {
  constructor(
    public unitsPerEm: Value,
    public ascender: Value,
    public descender: Value,
    public xHeight: Value,
    public capHeight: Value,
    public font?: Font
  ) {}

  public toJSON(): object {
    return {
      unitsPerEm: this.unitsPerEm,
      ascender: this.ascender,
      descender: this.descender,
      xHeight: this.xHeight,
      capHeight: this.capHeight,
    };
  }

  public static fromLiteral<
    Value extends ExpressibleAsNumber
  >(
    literal: FontAnatomy<Value>
  ): FontAnatomyInstance<Value> {
    return new FontAnatomyInstance(
      literal.unitsPerEm,
      literal.ascender,
      literal.descender,
      literal.xHeight,
      literal.capHeight,
      literal.font
    );
  }
}