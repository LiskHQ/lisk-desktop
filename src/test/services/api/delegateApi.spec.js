const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;
chai.use(sinonChai);

describe('Factory: delegateService', () => {
  let Peers;
  let $q;
  let delegateService;
  let mock;
  let deffered;

  beforeEach(angular.mock.module('app'));

  beforeEach(inject((_Peers_, _$q_, _delegateService_) => {
    Peers = _Peers_;
    $q = _$q_;
    delegateService = _delegateService_;
  }));

  beforeEach(() => {
    deffered = $q.defer();
    mock = sinon.mock(Peers);
  });

  afterEach(() => {
    mock.verify();
    mock.restore();
  });

  describe('listAccountDelegates(address)', () => {
    it('returns Peers.sendRequestPromise(\'accounts/delegates\', address);', () => {
      const address = {
        address: {},
      };
      mock.expects('sendRequestPromise').withArgs('accounts/delegates', address).returns(deffered.promise);

      const promise = delegateService.listAccountDelegates(address);

      expect(promise).to.equal(deffered.promise);
    });
  });

  describe('listDelegates(options)', () => {
    it('returns Peers.sendRequestPromise(\'delegates\', options);', () => {
      const options = {
        username: 'genesis_42',
      };
      mock.expects('sendRequestPromise').withArgs('delegates/', options).returns(deffered.promise);

      const promise = delegateService.listDelegates(options);

      expect(promise).to.equal(deffered.promise);
    });
  });

  describe('getDelegate(options)', () => {
    it('returns Peers.sendRequestPromise(\'delegates/get\', options);', () => {
      const options = {
        username: 'genesis_42',
      };
      mock.expects('sendRequestPromise').withArgs('delegates/get', options).returns(deffered.promise);

      const promise = delegateService.getDelegate(options);

      expect(promise).to.equal(deffered.promise);
    });
  });

  describe('vote(secret, publicKey, voteList, unvoteList, secondSecret = null)', () => {
    it('returns Peers.sendRequestPromise(\'accounts/delegates\', options);', () => {
      const secret = '';
      const publicKey = '';
      const secondPassphrase = undefined;
      const voteList = [{
        username: 'genesis_42',
      }];
      const unvoteList = [{
        username: 'genesis_24',
      }];
      mock.expects('sendRequestPromise').withArgs('accounts/delegates').returns(deffered.promise);

      const promise = delegateService.vote(secret, publicKey,
        voteList, unvoteList, secondPassphrase);

      expect(promise).to.equal(deffered.promise);
    });
  });

  describe('voteAutocomplete(username, votedDict)', () => {
    it('returns Peers.sendRequestPromise(\'delegates/search\', {q: username}) delegates filtered by not in voteDialog);', () => {
      const username = 'genesis_4';
      const votedDict = {
        genesis_44: {
        },
      };
      const delegates = [
        { username: 'genesis_42' },
        { username: 'genesis_44' },
      ];
      mock.expects('sendRequestPromise').withArgs('delegates/search', { q: username }).returns(deffered.promise);

      delegateService.voteAutocomplete(username, votedDict);
      deffered.resolve({ delegates });
    });
  });

  describe('unvoteAutocomplete(username, votedList)', () => {
    it('returns list of elements e of votedList such that e.username contains username);', () => {
      const username = 'genesis_4';
      const votedList = [
        { username: 'genesis_44' },
        { username: 'genesis_24' },
      ];

      const result = delegateService.unvoteAutocomplete(username, votedList);
      expect(result).to.deep.equal([votedList[0]]);
    });
  });
});

