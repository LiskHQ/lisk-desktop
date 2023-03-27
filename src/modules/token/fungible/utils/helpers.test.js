import { expect } from 'chai';
import { convertFromBaseDenom, convertToBaseDenom } from './helpers';

const mockLiskTokenMetadata = {
  displayDenom: 'lsk',
  denomUnits: [
    {
      denom: 'beddows',
      decimals: 0,
      aliases: ['Beddows'],
    },
    {
      denom: 'lsk',
      decimals: 8,
      aliases: ['Lisk'],
    },
  ],
};

const mockEventiTokenMetadata = {
  displayDenom: 'envt',
  denomUnits: [
    {
      denom: 'ventti',
      decimals: 0,
      aliases: ['Ventti'],
    },
    {
      denom: 'envt',
      decimals: 5,
      aliases: ['Enevti'],
    },
  ],
};

describe('Token utils', () => {
  describe('convertFromBaseDenom', () => {
    it('should convert beddows to lsk', () => {
      expect(convertFromBaseDenom(100000000, mockLiskTokenMetadata)).to.be.equal('1');
    });

    it('should convert ventti to envt', () => {
      expect(convertFromBaseDenom(10, mockEventiTokenMetadata)).to.be.equal('0.0001');
    });

    it('should handle conversion when passing empty token metadata', () => {
      expect(convertFromBaseDenom(5000000)).to.be.equal('0.05');
    });
  });

  describe('convertToBaseDenom', () => {
    it('should convert lsk to beddows', () => {
      expect(convertToBaseDenom(1, mockLiskTokenMetadata)).to.be.equal('100000000');
    });

    it('should convert envt to ventti', () => {
      expect(convertToBaseDenom(0.0001, mockEventiTokenMetadata)).to.be.equal('10');
    });

    it('should handle conversion when passing empty token metadata', () => {
      expect(convertToBaseDenom(0.05)).to.be.equal('5000000');
    });
  });
});
