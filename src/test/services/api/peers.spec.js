const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;
chai.use(sinonChai);

describe('Factory: Peers', () => {
  let Peers;
  let $q;
  let $rootScope;

  beforeEach(angular.mock.module('app'));

  beforeEach(inject((_Peers_, _$q_, _$rootScope_) => {
    Peers = _Peers_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  describe('setActive(account)', () => {
    it('sets Peers.active to a random active official peer', () => {
      const account = {
        network: {
          address: 'http://localhost:8000',
        },
      };
      expect(Peers.active).to.equal(undefined);
      Peers.setActive(account);
      expect(Peers.active).not.to.equal(undefined);
      expect(Peers.active.currentPeer).not.to.equal(undefined);
    });
  });

  describe('check()', () => {
    let deffered;
    let mock;

    beforeEach(() => {
      deffered = $q.defer();
      mock = sinon.mock(Peers);
      mock.expects('getStatus').returns(deffered.promise);
      Peers.active = {};
    });

    afterEach(() => {
      mock.verify();
      mock.restore();
    });

    it('checks active peer status and if that succeeds then sets this.online = true', () => {
      Peers.check();
      deffered.resolve();
      $rootScope.$apply();
      expect(Peers.online).to.equal(true);
    });

    it('checks active peer status and if that fails then sets this.online = false', () => {
      Peers.check();
      deffered.reject();
      $rootScope.$apply();
      expect(Peers.online).to.equal(false);
    });
  });
});
