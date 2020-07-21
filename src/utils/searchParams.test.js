import {
  parseSearchParams,
  strigifySearchParams,
  appendSearchParams,
  addSearchParamToUrl,
  removeSearchParam,
  removeSearchParamFromUrl,
} from './searchParams';

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

  describe('addSearchParamToUrl', () => {
    let history;

    beforeEach(() => {
      history = {
        push: jest.fn(),
        location: { search: '', pathname: '/path' },
      };
    });

    it('appends the search params correctly to the end of the search provided and redirects to that url', () => {
      addSearchParamToUrl(history, 'hello', 'world');
      expect(history.push).toHaveBeenCalledWith((`${history.location.pathname}?hello=world`));
      expect(history.push).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeSearchParam', () => {
    it('removes the search params correctly from the search provided and returns it', () => {
      expect(removeSearchParam('?hello=world', 'hello')).toEqual('');
      expect(removeSearchParam('?hello=world&jest=good', 'jest')).toEqual('?hello=world');
      expect(removeSearchParam('?hello=world&jest=good', 'hello')).toEqual('?jest=good');
      expect(removeSearchParam('?hello=world&jest=good&cats=mean', 'jest')).toEqual('?hello=world&cats=mean');
    });
  });

  describe('removeSearchParamFromUrl', () => {
    it('removes the search params correctly from the url and redirects to that url', () => {
      const history = {
        push: jest.fn(),
        location: { search: '?removeMe=value&notMe=value', pathname: '/path' },
      };

      removeSearchParamFromUrl(history, 'removeMe');
      expect(history.push).toHaveBeenCalledWith((`${history.location.pathname}?notMe=value`));
      expect(history.push).toHaveBeenCalledTimes(1);
    });
  });
});
