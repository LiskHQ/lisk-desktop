const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const VALID_PASSPHRASE = 'illegal symbol search tree deposit youth mixture craft amazing tool soon unit';

const expect = chai.expect;
chai.use(sinonChai);

describe('Factory: Account', () => {
  let account;
  let $rootScope;

  beforeEach(angular.mock.module('app'));

  beforeEach(inject((_Account_, _$rootScope_) => {
    account = _Account_;
    $rootScope = _$rootScope_;
  }));

  describe('set(config)', () => {
    it('returns this.account', () => {
      const accountInstanse = account.get();

      const setReturnValue = account.set({ passphrase: VALID_PASSPHRASE });

      expect(setReturnValue).to.equal(accountInstanse);
    });

    it('should set address and publicKey for a given valid passphrase', () => {
      const accountInstanse = account.set({ passphrase: VALID_PASSPHRASE });

      expect(accountInstanse.address).to.not.equal(undefined);
      expect(accountInstanse.publicKey).to.not.equal(undefined);
    });

    it('should broadcast the changes', () => {
      const spy = sinon.spy($rootScope, '$broadcast');
      account.set({ passphrase: VALID_PASSPHRASE });
      expect(spy).to.have.been.calledWith();
    });
  });

  describe('get(config)', () => {
    it('returns this.account', () => {
      account.set({ passphrase: VALID_PASSPHRASE });
      const accountInstanse = account.get();

      expect(accountInstanse).to.not.equal(undefined);
      expect(accountInstanse.address).to.not.equal(undefined);
      expect(accountInstanse.publicKey).to.not.equal(undefined);
      expect(accountInstanse.passphrase).to.not.equal(undefined);
    });
  });
});
