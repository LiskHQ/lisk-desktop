const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;
chai.use(sinonChai);

describe('Factory: $peers', () => {
  let $peers;
  let $q;
  let $rootScope;

  beforeEach(angular.mock.module('app'));

  beforeEach(inject((_$peers_, _$q_, _$rootScope_) => {
    $peers = _$peers_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  describe('setActive()', () => {
    it('sets $peers.active to a random active official peer', () => {
      expect($peers.active).to.equal(undefined);
      $peers.setActive();
      expect($peers.active).not.to.equal(undefined);
      expect($peers.stack.official).to.include({ node: $peers.active.currentPeer });
    });
  });

  describe('setPeerAPIObject', () => {
    const RECIPIENT_ADDRESS = '5932438298200837883L';
    const AMOUNT = '10';
    const PASSPHRASE = 'robust swift grocery peasant forget share enable convince deputy road keep cheap';

    beforeEach(() => {
      $peers.setActive();
      $peers.setPeerAPIObject({
        node: 'localhost',
        port: 4000,
        testnet: true,
        nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
      });
    });

    it('sets getter/setter methods on $peers.active if it\'s called with correct configs', () => {
      expect($peers.active.getStatusPromise).not.to.equal(undefined);
      expect($peers.active.getAccountPromise).not.to.equal(undefined);
      expect($peers.active.sendLSKPromise).not.to.equal(undefined);
      expect($peers.active.listTransactionsPromise).not.to.equal(undefined);
    });

    it('creates $peers.active.getStatusPromise which returns a promise', () => {
      const promise = $peers.active.getStatusPromise();
      $rootScope.$apply();
      expect(promise.then.constructor).to.be.equal(Function);
    });

    it('creates $peers.active.getAccountPromise which returns a promise', () => {
      const promise = $peers.active.getAccountPromise(RECIPIENT_ADDRESS);
      $rootScope.$apply();
      expect(promise.then.constructor).to.be.equal(Function);
    });

    it('creates $peers.active.sendLSKPromise which returns a promise', () => {
      const promise = $peers.active.sendLSKPromise(RECIPIENT_ADDRESS, AMOUNT, PASSPHRASE);
      $rootScope.$apply();
      expect(promise.then.constructor).to.be.equal(Function);
    });

    it('creates $peers.active.listTransactionsPromise which returns a promise', () => {
      const promise = $peers.active.listTransactionsPromise(RECIPIENT_ADDRESS, AMOUNT);
      $rootScope.$apply();
      expect(promise.then.constructor).to.be.equal(Function);
    });
  });

  describe('check()', () => {
    let deffered;
    let mock;

    beforeEach(() => {
      deffered = $q.defer();
      $peers.active = {
        getAccountPromise() {
          return deffered.promise;
        },
        getStatusPromise() {
          return $q.defer().promise;
        },
      };
      mock = sinon.mock($peers.active);
      mock.expects('getStatusPromise').withArgs().returns(deffered.promise);
    });

    afterEach(() => {
      mock.verify();
      mock.restore();
    });

    it('checks active peer status and if that succeeds then sets this.online = true', () => {
      $peers.check();
      deffered.resolve();
      $rootScope.$apply();
      expect($peers.online).to.equal(true);
    });

    it('checks active peer status and if that fails then sets this.online = false', () => {
      $peers.check();
      deffered.reject();
      $rootScope.$apply();
      expect($peers.online).to.equal(false);
    });
  });
});
