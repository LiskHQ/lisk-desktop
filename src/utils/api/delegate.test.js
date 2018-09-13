import { expect } from 'chai';
import sinon from 'sinon';
import Lisk from 'lisk-elements';
import {
  listDelegates,
  listAccountDelegates,
  getDelegate,
  vote,
  getVotes,
  getVoters,
  registerDelegate } from './delegate';
import accounts from '../../../test/constants/accounts';

describe('Utils: Delegate', () => {
  let activePeerMockDelegates;
  let activePeerMockVotes;
  let activePeerMockVoters;
  let activePeerMockTransations;
  let liskTransactionsCastVotesStub;
  let liskTransactionsRegisterDelegateSpy;
  const timeOffset = 0;

  const activePeer = {
    delegates: {
      get: () => { },
    },
    votes: {
      get: sinon.spy(),
    },
    voters: {
      get: () => { },
    },
    transactions: {
      broadcast: () => {},
    },
  };

  beforeEach(() => {
    liskTransactionsCastVotesStub = sinon.stub(Lisk.transaction, 'castVotes');
    liskTransactionsRegisterDelegateSpy = sinon.spy(Lisk.transaction, 'registerDelegate');
    activePeerMockDelegates = sinon.mock(activePeer.delegates);
    activePeerMockVotes = sinon.mock(activePeer.votes);
    activePeerMockVoters = sinon.mock(activePeer.voters);
    activePeerMockTransations = sinon.stub(activePeer.transactions, 'broadcast').returnsPromise().resolves({ id: '1234' });
  });

  afterEach(() => {
    activePeerMockDelegates.verify();
    activePeerMockDelegates.restore();

    activePeerMockVotes.verify();
    activePeerMockVotes.restore();

    activePeerMockVoters.verify();
    activePeerMockVoters.restore();

    activePeerMockTransations.restore();

    liskTransactionsCastVotesStub.restore();
    liskTransactionsRegisterDelegateSpy.restore();
  });

  describe('listAccountDelegates', () => {
    it('should get votes for an address with 101 limit', () => {
      const address = '123L';
      listAccountDelegates(activePeer, address);
      expect(activePeer.votes.get).to.have.been.calledWith({ address, limit: '101' });
    });
  });

  describe('listDelegates', () => {
    it('should return getDelegate(activePeer, options) if options = {}', () => {
      const options = {};
      const response = { data: [] };
      activePeerMockDelegates.expects('get').withArgs(options).returnsPromise().resolves(response);

      const returnedPromise = listDelegates(activePeer, options);
      expect(returnedPromise).to.eventually.equal(response);
    });

    it('should return getDelegate(activePeer, options) if options.q is set', () => {
      const options = { q: 'genesis_1' };
      const response = { data: [] };
      activePeerMockDelegates.expects('get').withArgs(options).returnsPromise().resolves(response);

      const returnedPromise = listDelegates(activePeer, options);
      return expect(returnedPromise).to.eventually.equal(response);
    });
  });

  describe('getDelegate', () => {
    it('should return getDelegate(activePeer, options)', () => {
      const options = { publicKey: `"${accounts.delegate.publicKey}"` };
      const response = { data: [] };
      activePeerMockDelegates.expects('get').withArgs(options).returnsPromise().resolves(response);

      const returnedPromise = getDelegate(activePeer, options);
      return expect(returnedPromise).to.eventually.equal(response);
    });
  });

  describe('vote', () => {
    it('should call castVotes and broadcast transaction', () => {
      const votes = [
        accounts.genesis.publicKey,
        accounts.delegate.publicKey,
      ];
      const unvotes = [
        accounts['empty account'].publicKey,
        accounts['delegate candidate'].publicKey,
      ];
      const transaction = { id: '1234' };
      const secondPassphrase = null;
      liskTransactionsCastVotesStub.withArgs({
        votes,
        unvotes,
        passphrase: accounts.genesis.passphrase,
        secondPassphrase,
        timeOffset,
      }).returns(transaction);

      vote(
        activePeer,
        accounts.genesis.passphrase,
        accounts.genesis.publicKey,
        votes,
        unvotes,
        secondPassphrase,
        timeOffset,
      );
      expect(activePeer.transactions.broadcast).to.have.been.calledWith(transaction);
    });
  });

  describe('getVotes', () => {
    it('should get votes for an address with no parameters', () => {
      const address = '123L';
      getVotes(activePeer, address);
      expect(activePeer.votes.get).to.have.been.calledWith({ address });
    });
  });

  describe('getVoters', () => {
    it('should return getVoters(activePeer, publicKey)', () => {
      const publicKey = '';
      activePeerMockVoters.expects('get').withArgs({ publicKey })
        .returnsPromise().resolves('resolved promise');

      const returnedPromise = getVoters(activePeer, publicKey);
      expect(returnedPromise).to.eventually.equal('resolved promise');
    });
  });

  describe('registerDelegate', () => {
    it('should broadcast a registerDelegate transaction', () => {
      const registerDelegateArgs = [null, 'username', 'passphrase', 'secondPassphrase', timeOffset];
      registerDelegate(...registerDelegateArgs);
      expect(liskTransactionsRegisterDelegateSpy).to.have.been.calledWith({
        username: 'username',
        passphrase: 'passphrase',
        secondPassphrase: 'secondPassphrase',
        timeOffset,
      });
    });
  });
});
