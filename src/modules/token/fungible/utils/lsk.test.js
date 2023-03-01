import { expect } from 'chai';
import { convertToDenom, fromRawLsk, toRawLsk } from '@token/fungible/utils/lsk';

const mockToken = {
  symbol: 'LSK',
  denomUnits: [{ denom: 'lsk', decimals: 8 }],
};

describe('lsk', () => {
  describe('fromRawLsk', () => {
    it('should convert 100000000 to "1"', () => {
      expect(fromRawLsk(100000000)).to.be.equal('1');
    });

    it('should convert 0 to "0"', () => {
      expect(fromRawLsk(0)).to.be.equal('0');
    });
  });

  describe('toRawLsk', () => {
    it('should convert 1 to 100000000', () => {
      expect(toRawLsk(1)).to.be.equal(100000000);
    });

    it('should convert 0 to 0', () => {
      expect(toRawLsk(0)).to.be.equal(0);
    });
  });

  describe('convertToDenom', () => {
    it('should convert 100000000 to 1', () => {
      expect(convertToDenom(100000000, mockToken)).to.be.equal('1');
    });

    it('should use default decimal value', () => {
      expect(convertToDenom(100000000, { ...mockToken, symbol: 'ENV' })).to.be.equal('0');
      expect(convertToDenom(100000000)).to.be.equal('0');
    });

    it('should use token`s decimal value', () => {
      expect(
        convertToDenom(100000000, {
          ...mockToken,
          symbol: 'ENV',
          denomUnits: [{ denom: 'env', decimals: 5 }],
        })
      ).to.be.equal('1000');
    });

    it('should return a zero value', () => {
      expect(convertToDenom()).to.be.equal('0');
    });
  });
});
