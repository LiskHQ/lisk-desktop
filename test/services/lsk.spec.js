const chai = require('chai');

const expect = chai.expect;

describe('Factory: lsk', () => {
  let lsk;

  beforeEach(angular.mock.module('app'));

  beforeEach(inject((_lsk_) => {
    lsk = _lsk_;
  }));

  describe('normalize(value)', () => {
    it('converts 1 to \'0.00000001\'', () => {
      expect(lsk.normalize(1)).to.equal('0.00000001');
    });
  });

  describe('from(value)', () => {
    it('converts 0.00000001 to 1', () => {
      expect(lsk.from(0.00000001)).to.equal(1);
    });

    it('converts 1 to 100000000', () => {
      expect(lsk.from(1)).to.equal(100000000);
    });

    it('converts 10535.67379498 to 1053567379498', () => {
      expect(lsk.from(10535.67379498)).to.equal(1053567379498);
    });
  });

  describe('normalize(from(value))', () => {
    it('is identity function on 1', () => {
      const value = '1';
      expect(lsk.normalize(lsk.from(value))).to.equal(value);
    });

    it('is identity function on 10535.67379498', () => {
      const value = '10535.67379498';
      expect(lsk.normalize(lsk.from(value))).to.equal(value);
    });
  });

  describe('from(normalize(value))', () => {
    it('is identity function on 100000000', () => {
      const value = 100000000;
      expect(lsk.from(lsk.normalize(value))).to.equal(value);
    });

    it('is identity function on 1053567379498', () => {
      const value = 1053567379498;
      expect(lsk.from(lsk.normalize(value))).to.equal(value);
    });
  });
});

