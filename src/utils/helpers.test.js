import React from 'react';
import {
  deepMergeObj,
  removeUndefinedKeys,
  isEmpty,
  sizeOfString,
  isReactComponent,
  kFormatter,
  capitalize,
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
  describe('sizeOfString', () => {
    it('should calculate the size of a string', () => {
      expect(sizeOfString('random string')).toEqual(13);
    });

    it('should calculate the size of null', () => {
      expect(sizeOfString()).toEqual(0);
    });
  });
  describe('isReactComponent', () => {
    it('detects class components', () => {
      class TextComponent extends React.Component {
        render() {
          return <div />;
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

  describe('kFormatter', () => {
    it('uses K notation for numbers in thousands range', () => {
      expect(kFormatter(1000)).toEqual('1K');
      expect(kFormatter(1100)).toEqual('1K');
      expect(kFormatter(1100, 1)).toEqual('1.1K');
      expect(kFormatter(81000)).toEqual('81K');
      expect(kFormatter(81000, 1)).toEqual('81.0K');
    });
    it('uses M notation for numbers in millions range', () => {
      expect(kFormatter(1000000)).toEqual('1M');
      expect(kFormatter(1100000)).toEqual('1M');
      expect(kFormatter(1100000, 1)).toEqual('1.1M');
      expect(kFormatter(81000000)).toEqual('81M');
      expect(kFormatter(81000000, 1)).toEqual('81.0M');
    });
    it('returns numbers under 1K unchanged', () => {
      expect(kFormatter(999)).toEqual(999);
      expect(kFormatter(0)).toEqual(0);
      expect(kFormatter(1, 1)).toEqual(1);
    });
  });

  describe('Capitalize', () => {
    it('should capitalize strings', () => {
      expect(capitalize('sample string')).toEqual('Sample string');
      expect(capitalize('samplestring')).toEqual('Samplestring');
      expect(capitalize('sampleString')).toEqual('Samplestring');
    });
  });
});
