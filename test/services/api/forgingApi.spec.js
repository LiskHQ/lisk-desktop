const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;
chai.use(sinonChai);

describe('Factory: forgingService', () => {
  let Peers;
  let $q;
  let forgingService;
  let mock;
  let deffered;

  beforeEach(angular.mock.module('app'));

  beforeEach(inject((_Peers_, _$q_, _forgingService_) => {
    Peers = _Peers_;
    $q = _$q_;
    forgingService = _forgingService_;
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

      const promise = forgingService.getDelegate();

      expect(promise).to.equal(deffered.promise);
    });
  });

  describe('getForgedBlocks(limit, offset)', () => {
    it('returns Peers.sendRequestPromise(\'blocks\');', () => {
      mock.expects('sendRequestPromise').withArgs('blocks').returns(deffered.promise);

      const promise = forgingService.getForgedBlocks();

      expect(promise).to.equal(deffered.promise);
    });
  });

  describe('getForgedStats(startMoment)', () => {
    it('returns Peers.sendRequestPromise(\'delegates/forging/getForgedByAccount\');', () => {
      mock.expects('sendRequestPromise').withArgs('delegates/forging/getForgedByAccount').returns(deffered.promise);

      const promise = forgingService.getForgedStats();

      expect(promise).to.equal(deffered.promise);
    });
  });
});

