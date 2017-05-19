const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chai = require('chai');

const expect = chai.expect;

const delegateAccount = {
  passphrase: 'recipe bomb asset salon coil symbol tiger engine assist pact pumpkin visit',
  address: '537318935439898807L',
};

chai.use(sinonChai);

describe('Application run method', () => {
  let $rootScope;
  let account;
  let peers;
  let $timeout;

  beforeEach(angular.mock.module('app'));

  beforeEach(inject((_$rootScope_, _$timeout_, _Peers_, _Account_) => {
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
    account = _Account_;
    peers = _Peers_;
  }));

  beforeEach(() => {
    account.set({ passphrase: delegateAccount.passphrase });
    peers.setActive({
      name: 'Mainnet',
    });
  });

  describe('reset()', () => {
    it('cancels $rootScope.$timeout', () => {
      const spy = sinon.spy($timeout, 'cancel');
      $rootScope.reset();
      expect(spy).to.have.been.calledWith($rootScope.$timeout);
    });
  });

  describe('logout()', () => {
    it('resets application', () => {
      const spy = sinon.spy($rootScope, 'reset');
      $rootScope.logout();
      expect(spy).to.have.been.calledWith();
    });

    it('resets peers', () => {
      const spy = sinon.spy(peers, 'reset');
      $rootScope.logout();
      expect(spy).to.have.been.calledWith(true);
    });

    it('sets $rootScope.logged = false', () => {
      $rootScope.logout();
      expect($rootScope.logged).to.equal(false);
    });

    it('sets $rootScope.prelogged = false', () => {
      $rootScope.logout();
      expect($rootScope.prelogged).to.equal(false);
    });

    it('resets account service', () => {
      $rootScope.logout();
      expect(account.get()).to.deep.equal({});
    });
  });
});
