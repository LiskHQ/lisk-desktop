import React from 'react';
import {
  deepMergeObj,
  removeUndefinedKeys,
  isEmpty,
  filterObjectPropsWithValue,
  sizeOfString,
  isReactComponent,
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
  describe('sizeOfString', () => {
    it('should calculate the size of a string', () => {
      expect(sizeOfString('random string')).toEqual(13);
    });

    it('should calculate the size of null', () => {
      expect(sizeOfString()).toEqual(9);
    });
  });
  describe('isReactComponent', () => {
    it('detects class components', () => {
      class TextComponent extends React.Component {
        render() {
          return (<div />);
        }
      }
      expect(isReactComponent(TextComponent)).toEqual('class');
    });
    it('detects class components', () => {
      const TextComponent = () => <div />;
      expect(isReactComponent(TextComponent)).toEqual('function');
    });
    it('detects class components', () => {
      const NoComponent = () => 'some_other_value';
      expect(isReactComponent(NoComponent)).toEqual(false);
    });
  });
});
