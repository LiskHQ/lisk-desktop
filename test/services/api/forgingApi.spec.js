const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;
chai.use(sinonChai);

describe('Factory: forgingApi', () => {
  let Peers;
  let $q;
  let forgingApi;
  let mock;
  let deffered;

  beforeEach(angular.mock.module('app'));

  beforeEach(inject((_Peers_, _$q_, _forgingApi_) => {
    Peers = _Peers_;
    $q = _$q_;
    forgingApi = _forgingApi_;
  }));

  beforeEach(() => {
    deffered = $q.defer();
    mock = sinon.mock(Peers);
  });

  afterEach(() => {
    mock.verify();
    mock.restore();
  });

  describe('getDelegate()', () => {
    it('returns Peers.sendRequestPromise(\'delegates/get\');', () => {
      mock.expects('sendRequestPromise').withArgs('delegates/get').returns(deffered.promise);

      const promise = forgingApi.getDelegate();

      expect(promise).to.equal(deffered.promise);
    });
  });

  describe('getForgedBlocks(limit, offset)', () => {
    it('returns Peers.sendRequestPromise(\'blocks\');', () => {
      mock.expects('sendRequestPromise').withArgs('blocks').returns(deffered.promise);

      const promise = forgingApi.getForgedBlocks();

      expect(promise).to.equal(deffered.promise);
    });
  });

  describe('getForgedStats(startMoment)', () => {
    it('returns Peers.sendRequestPromise(\'delegates/forging/getForgedByAccount\');', () => {
      mock.expects('sendRequestPromise').withArgs('delegates/forging/getForgedByAccount').returns(deffered.promise);

      const promise = forgingApi.getForgedStats();

      expect(promise).to.equal(deffered.promise);
    });
  });
});

