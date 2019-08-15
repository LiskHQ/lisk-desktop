import { expect } from 'chai';
import { fromRawLsk, toRawLsk, formatBasedOnLocale } from './lsk';

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

  describe('formatBasedOnLocale', () => {
    it('should format to EN by default', () => {
      const data = { value: 1.23 };
      expect(formatBasedOnLocale(data)).to.be.equal('1.23');
    });

    it('should format correctly to DE', () => {
      const data = {
        value: 1.23,
        locale: 'de',
      };
      expect(formatBasedOnLocale(data)).to.be.equal('1,23');
    });
  });
});
