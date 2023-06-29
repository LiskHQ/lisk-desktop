import { calculateSupply } from './helpers';

describe('helpers', () => {
  describe('calculateSupply', () => {
    it('accurately calculates percentage supply', () => {
      const balance = 525;
      const totalSupply = 10000;
      expect(calculateSupply(balance, totalSupply)).toEqual('5.25');
    });
  });
});
