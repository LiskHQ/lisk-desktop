import { parseSearchParams } from './searchParams';

const TEST_URLS = ['?a=1&b=2&c=3', '?a=1&b=2&c=3,4,5', '?a=1,2,3&b=1,5&c=d'];

describe('Search Params', () => {
  describe('parseSearchParams', () => {
    it('parses the search params correctly', () => {
      expect(parseSearchParams(TEST_URLS[0])).toStrictEqual({ a: '1', b: '2', c: '3' });
      expect(parseSearchParams(TEST_URLS[1])).toStrictEqual({ a: '1', b: '2', c: ['3', '4', '5'] });
      expect(parseSearchParams(TEST_URLS[2])).toStrictEqual({ a: ['1', '2', '3'], b: ['1', '5'], c: 'd' });
    });
  });
});
