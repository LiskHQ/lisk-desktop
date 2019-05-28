import {
  deepMergeObj,
  removeUndefinedKeys,
  isEmpty,
} from './helpers';


describe('helpers', () => {
  describe('deepMergeObj', () => {
    it('should merge 2 objects recursively', () => {
      const obj1 = {
        a: 1,
        b: [1, 2, 3],
        c: {
          d: false,
          e: 'test',
        },
        f: { g: { h: '1' } },
      };
      const obj2 = {
        a: 4,
        b: ['a', 'v'],
        f: { g2: { h: '2' } },
      };
      const expected = {
        a: 4,
        b: ['a', 'v'],
        c: { d: false, e: 'test' },
        f: {
          g: { h: '1' },
          g2: { h: '2' },
        },
      };
      expect(deepMergeObj(obj1, obj2)).toEqual(expected);
    });
  });

  describe('removeUndefinedKeys', () => {
    it('removes undefined keys from the source object', () => {
      const source = { a: undefined, b: 'b', c: 0 };
      expect(removeUndefinedKeys(source)).toEqual({ b: 'b', c: 0 });
    });
  });

  describe('isEmpty', () => {
    it('works properly with arrays', () => {
      expect(isEmpty([])).toBe(true);
    });

    it('works properly with objects', () => {
      expect(isEmpty({ test: 'test' })).toBe(false);
    });
  });
});
