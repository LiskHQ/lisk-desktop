import {
  deepMergeObj,
  removeUndefinedKeys,
  isEmpty,
  filterObjectPropsWithValue,
  sizeOf,
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
  describe('filterObjectPropsWithValue', () => {
    it('works properly with arrays', () => {
      expect(filterObjectPropsWithValue({
        genesis_14: 'notVotedYet',
        genesis_15: 'unvotes',
        genesis_16: 'unvotes',
        genesis_17: 'votes',
      }, 'unvotes')).toEqual(['genesis_15', 'genesis_16']);
    });
  });
  describe('sizeOf', () => {
    it('should calculate the size of a string', () => {
      expect(sizeOf('random string')).toEqual(26);
    });
    it('should calculate the size of a number', () => {
      expect(sizeOf(1234)).toEqual(8);
    });
    it('should calculate the size of a boolean', () => {
      expect(sizeOf(true)).toEqual(4);
    });
    it('should calculate the size of an array', () => {
      expect(sizeOf([true, 'str', 123])).toEqual(18);
    });
    it('should calculate the size of an object', () => {
      expect(sizeOf({ a: 123 })).toEqual(10);
    });
    it('should calculate the size of null', () => {
      expect(sizeOf()).toEqual(0);
    });
  });
});
