import { expect } from 'chai';
import { deepEquals } from './polyfills';

describe('Polyfills', () => {
  describe('deepEquals', () => {
    it('should return True if both parameters are undefined', () => {
      const ref1 = undefined;
      const ref2 = undefined;
      expect(deepEquals(ref1, ref2)).to.be.equal(true);
    });

    it('should return false for any none equal primary type pair of values', () => {
      // same type different values
      let ref1 = 1;
      let ref2 = 2;
      expect(deepEquals(ref1, ref2)).to.be.equal(false);

      // different types
      ref1 = '1';
      ref2 = 1;
      expect(deepEquals(ref1, ref2)).to.be.equal(false);
    });

    it('should return false for reference values with different primary members', () => {
      // different arrays
      let ref1 = [2, 3, 4, 5];
      let ref2 = [2, 3, 4, 6];
      expect(deepEquals(ref1, ref2)).to.be.equal(false);

      // different objects
      ref1 = { key1: { inner1: 'value 1' } };
      ref2 = { key2: { inner2: 'value 2' } };
      expect(deepEquals(ref1, ref2)).to.be.equal(false);
    });
    it('should return true for reference values with equal primary members', () => {
      // same objects
      const ref1 = { key1: [1, 2, 3] };
      const ref2 = { key1: [1, 2, 3] };
      expect(deepEquals(ref1, ref2)).to.be.equal(true);
    });
  });
});
