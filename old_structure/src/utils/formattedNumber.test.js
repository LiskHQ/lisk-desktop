import { formatAmountBasedOnLocale } from './formattedNumber';

describe('Formatted number utils', () => {
  describe('formatAmountBasedOnLocale', () => {
    it('should format to EN by default', () => {
      const data = { value: 1.23 };
      expect(formatAmountBasedOnLocale(data)).toEqual('1.23');
    });
  });
});
