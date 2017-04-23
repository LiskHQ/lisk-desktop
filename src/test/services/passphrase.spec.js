const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;
chai.use(sinonChai);
const TEST_SEED = ['12', '12', '12', '12', '12', '12', '12', '12',
  '12', '12', '12', '12', '12', '12', '12', '12'];
const INVALID_PASSPHRASE = 'INVALID_PASSPHRASE';

describe('Factory: Passphrase', () => {
  let Passphrase;

  beforeEach(angular.mock.module('app'));

  beforeEach(inject((_Passphrase_) => {
    Passphrase = _Passphrase_;
  }));

  describe('Passphrase.reset()', () => {
    it('resets percentage of progress and seed', () => {
      Passphrase.init();
      Passphrase.progress = {
        percentage: 50,
        seed: TEST_SEED,
      };
      Passphrase.reset();
      expect(Passphrase.progress.percentage).to.equal(0);
      let allZero = true;
      Passphrase.progress.seed.forEach(member => (allZero = (allZero && member === '00')));
      expect(allZero).to.equal(true);
    });
  });

  describe('Passphrase.init()', () => {
    it('should define progress.steps as a number above 1.6', () => {
      Passphrase.init();
      expect(Passphrase.progress.step).to.be.above(1.6);
    });

    it('should call Passphrase.reset()', () => {
      const spy = sinon.spy(Passphrase, 'reset');
      Passphrase.init();
      expect(spy).to.have.been.calledWith();
    });
  });

  describe('Passphrase.progress', () => {
    it('should define progress object', () => {
      Passphrase.init();
      expect(Passphrase.progress).to.not.equal(undefined);
    });
  });

  describe('Passphrase.generatePassPhrase', () => {
    it('should generate a valid passphrase out of a given valid seed array', () => {
      const passphrase = Passphrase.generatePassPhrase(TEST_SEED);
      const isValid = Passphrase.isValidPassphrase(passphrase);
      expect(isValid).to.equal(1);
    });
  });

  describe('Passphrase.isValidPassphrase', () => {
    it('should return 1 for a valid passphrase', () => {
      const passphrase = Passphrase.generatePassPhrase(TEST_SEED);
      const isValid = Passphrase.isValidPassphrase(passphrase);
      expect(isValid).to.equal(1);
    });

    it('should return 0 for an invalid passphrase', () => {
      const isValid = Passphrase.isValidPassphrase(INVALID_PASSPHRASE);
      expect(isValid).to.equal(0);
    });

    it('should return 2 for an empty passphrase', () => {
      const isValid = Passphrase.isValidPassphrase('');
      expect(isValid).to.equal(2);
    });
  });

  describe('Passphrase.normalize', () => {
    it('should trim multiple spaces globally and lowercase the string', () => {
      const rawString = '   FIRST   second  Third   ';
      const fixedString = 'first second third';
      const result = Passphrase.normalize(rawString);
      expect(result).to.equal(fixedString);
    });
  });

  describe('Passphrase.listener', () => {
    it('should update progress percentage and seed if called with proper event', () => {
      Passphrase.init();
      const event = {
        pageY: 0,
        pageX: 0,
      };
      let percentage = -1;
      let isProgressIncreasing = true;

      // √(2 * 90^2) > 120
      for (let i = 0; i < 100; i++) {
        event.pageX = i * 90;
        event.pageY = i * 90;
        Passphrase.listener(event, () => {});
        isProgressIncreasing = isProgressIncreasing &&
          (percentage <= Passphrase.progress.percentage ||
          Math.floor(Passphrase.progress.percentage) === 100);
        percentage = Passphrase.progress.percentage;
      }
      expect(isProgressIncreasing).to.equal(true);
    });

    it('should call callback if progress percentage is equal to 100', () => {
      Passphrase.init();
      const event = {
        pageY: 0,
        pageX: 0,
      };
      let seed = null;
      const callback = param => seed = param;

      // √(2 * 90^2) > 120
      for (let i = 0; i < 100; i++) {
        event.pageX = i * 90;
        event.pageY = i * 90;
        Passphrase.listener(event, callback);
      }
      expect(seed).to.not.equal(undefined);
    });
  });
});
