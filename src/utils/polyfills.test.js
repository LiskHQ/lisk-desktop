import { expect } from 'chai';
import deepEquals from './polyfills';

describe('Polyfills', () => {
  it('should return True if both parameters are undefined', () => {
    const ref1 = undefined;
    const ref2 = undefined;
    expect(deepEquals(ref1, ref2)).to.be.equal(true);
  });
});
