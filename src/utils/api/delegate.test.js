import { expect } from 'chai';
import sinon from 'sinon';
import {
  listDelegates,
  getDelegate,
  getVotes,
  getVoters,
  registerDelegate } from './delegate';
import accounts from '../../../test/constants/accounts';

describe('Utils: Delegate', () => {
  let activePeerMockDelegates;
  let activePeerMockVotes;
  let activePeerMockVoters;
  let activePeerMockTransations;

  const activePeer = {
    delegates: {
      get: () => { },
    },
    votes: {
      get: () => { },
    },
    voters: {
      get: () => { },
    },
    transactions: {
      broadcast: () => { },
    },
  };

  beforeEach(() => {
    activePeerMockDelegates = sinon.mock(activePeer.delegates);
    activePeerMockVotes = sinon.mock(activePeer.votes);
    activePeerMockVoters = sinon.mock(activePeer.voters);
    activePeerMockTransations = sinon.mock(activePeer.transactions);
  });

  afterEach(() => {
    activePeerMockDelegates.verify();
    activePeerMockDelegates.restore();

    activePeerMockVotes.verify();
    activePeerMockVotes.restore();

    activePeerMockVoters.verify();
    activePeerMockVoters.restore();

    activePeerMockTransations.verify();
    activePeerMockTransations.restore();
  });

  describe('listDelegates', () => {
    it('should return requestToActivePeer(activePeer, `delegates/`, options) if options = {}', () => {
      const options = {};
      const response = { data: [] };
      activePeerMockDelegates.expects('get').withArgs(options).returnsPromise().resolves(response);

      const returnedPromise = listDelegates(activePeer, options);
      return expect(returnedPromise).to.eventually.equal(response);
    });

    it('should return requestToActivePeer(activePeer, `delegates/search`, options) if options.q is set', () => {
      const options = { q: 'genesis_1' };
      const response = { data: [] };
      activePeerMockDelegates.expects('get').withArgs(options).returnsPromise().resolves(response);

      const returnedPromise = listDelegates(activePeer, options);
      return expect(returnedPromise).to.eventually.equal(response);
    });
  });

  describe('getDelegate', () => {
    it('should return requestToActivePeer(activePeer, `delegates/get`, options)', () => {
      const options = { publicKey: `"${accounts.delegate.publicKey}"` };
      const response = { data: [] };
      activePeerMockDelegates.expects('get').withArgs(options).returnsPromise().resolves(response);

      const returnedPromise = getDelegate(activePeer, options);
      return expect(returnedPromise).to.eventually.equal(response);
    });
  });

  describe('getVotes', () => {
    it('should return requestToActivePeer(activePeer, `accounts/delegates/`, options)', () => {
      const { address } = accounts.delegate;
      activePeerMockVotes.expects('get').withArgs({ address })
        .returnsPromise().resolves('resolved promise');

      const returnedPromise = getVotes(activePeer, address);
      return expect(returnedPromise).to.eventually.equal('resolved promise');
    });
  });


  describe('getVoters', () => {
    it('should return requestToActivePeer(activePeer, `delegates/voters`, options)', () => {
      const publicKey = '';
      activePeerMockVoters.expects('get').withArgs({ publicKey })
        .returnsPromise().resolves('resolved promise');

      const returnedPromise = getVoters(activePeer, publicKey);
      return expect(returnedPromise).to.eventually.equal('resolved promise');
    });
  });

  describe('registerDelegate', () => {
    it('should return a promise', () => {
      const promise = registerDelegate(null, 'username', 'passphrase', 'secondPassphrase');
      expect(typeof promise.then).to.be.equal('function');
    });
  });
});
