import { parseSearchParams, strigifySearchParams, appendSearchParams } from './searchParams';

const TEST_URLS = ['?a=1', '?a=1&b=2&c=3', '?a=1&b=2&c=3,4,5', '?a=1,2,3&b=1,5&c=d'];

describe('Search Params', () => {
  describe('parseSearchParams', () => {
    it('parses the search params correctly', () => {
      expect(parseSearchParams(TEST_URLS[0])).toStrictEqual({ a: '1' });
      expect(parseSearchParams(TEST_URLS[1])).toStrictEqual({ a: '1', b: '2', c: '3' });
      expect(parseSearchParams(TEST_URLS[2])).toStrictEqual({ a: '1', b: '2', c: ['3', '4', '5'] });
      expect(parseSearchParams(TEST_URLS[3])).toStrictEqual({ a: ['1', '2', '3'], b: ['1', '5'], c: 'd' });
    });
  });


  describe('strigifySearchParams', () => {
    it('strigifies the search params correctly', () => {
      expect(strigifySearchParams(parseSearchParams(''))).toEqual('');
      expect(strigifySearchParams(parseSearchParams(TEST_URLS[0]))).toEqual(TEST_URLS[0]);
      expect(strigifySearchParams(parseSearchParams(TEST_URLS[1]))).toEqual(TEST_URLS[1]);
      expect(strigifySearchParams(parseSearchParams(TEST_URLS[2]))).toEqual(TEST_URLS[2]);
      expect(strigifySearchParams(parseSearchParams(TEST_URLS[3]))).toEqual(TEST_URLS[3]);
    });
  });

  describe('appendSearchParams', () => {
    it('appends the search params correctly to the end of the search provided', () => {
      expect(appendSearchParams(TEST_URLS[0], 'hello', 'world')).toEqual(`${TEST_URLS[0]}&hello=world`);
      expect(appendSearchParams(TEST_URLS[0], 'hello', 42)).toEqual(`${TEST_URLS[0]}&hello=42`);
      expect(appendSearchParams(TEST_URLS[1], 'hello', 'world')).toEqual(`${TEST_URLS[1]}&hello=world`);
      expect(appendSearchParams(TEST_URLS[1], 'hello', 42)).toEqual(`${TEST_URLS[1]}&hello=42`);
    });
  });
});
