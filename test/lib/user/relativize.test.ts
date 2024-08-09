import {FontAnatomy} from '!src/font-anatomy';
import {relativize} from '!src/relativize';
import {ExpressibleAsNumber} from '!src/expressible-as-number';

describe('relativize', () => {
  describe('number based', () => {
    const anatomy: FontAnatomy<number> = {
      unitsPerEm: 1000,
      ascender: 800,
      descender: -200,
      xHeight: 500,
      capHeight: 700,
    };

    it('should return a FontAnatomy with relative values', () => {
      const result = relativize(anatomy, 'unitsPerEm');
      expect(result).toEqual({
        unitsPerEm: 1,
        ascender: 0.8,
        descender: -0.2,
        xHeight: 0.5,
        capHeight: 0.7,
      });
    });
  });

  describe('Points based', () => {
    const anatomy: FontAnatomy<Points> = {
      unitsPerEm: Points.fromNumber(1000),
      ascender: Points.fromNumber(800),
      descender: Points.fromNumber(-200),
      xHeight: Points.fromNumber(500),
      capHeight: Points.fromNumber(700),
    };

    it('should return a FontAnatomy with relative values', () => {
      const result = relativize(anatomy, 'unitsPerEm', Points.fromNumber);
      expect(result).toEqual({
        unitsPerEm: new Points(1),
        ascender: new Points(0.8),
        descender: new Points(-0.2),
        xHeight: new Points(0.5),
        capHeight: new Points(0.7),
      });
    });
  });
});

class Points implements ExpressibleAsNumber {
  private value: number;
  constructor(value: number) {this.value = value;}
  valueOf() {return this.value;}
  static fromNumber(n: number) {return new Points(n);}
}