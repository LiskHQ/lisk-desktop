import { expect } from 'chai';
import sinon from 'sinon';
import Lisk from '@liskhq/lisk-client';
import {
  listDelegates,
  getDelegate,
  vote,
  getVotes,
  registerDelegate,
} from './delegate';
import accounts from '../../../test/constants/accounts';
import { loginType } from '../../constants/hwConstants';

describe('Utils: Delegate', () => {
  let liskAPIClientMockDelegates;
  let liskAPIClientMockVotes;
  let liskAPIClientMockTransations;
  let liskTransactionsCastVotesStub;
  let liskTransactionsRegisterDelegateStub;
  const timeOffset = 0;

  const liskAPIClient = {
    delegates: {
      get: () => { },
    },
    votes: {
      get: () => { },
    },
    transactions: {
      broadcast: () => {},
    },
  };

  beforeEach(() => {
    liskTransactionsCastVotesStub = sinon.stub(Lisk.transaction, 'castVotes');
    liskTransactionsRegisterDelegateStub = sinon.stub(Lisk.transaction, 'registerDelegate');
    liskAPIClientMockDelegates = sinon.mock(liskAPIClient.delegates);
    liskAPIClientMockVotes = sinon.mock(liskAPIClient.votes);
    liskAPIClientMockTransations = sinon.stub(liskAPIClient.transactions, 'broadcast').returnsPromise().resolves({ id: '1234' });
  });

  afterEach(() => {
    liskAPIClientMockDelegates.verify();
    liskAPIClientMockDelegates.restore();

    liskAPIClientMockVotes.verify();
    liskAPIClientMockVotes.restore();

    liskAPIClientMockTransations.restore();

    liskTransactionsCastVotesStub.restore();
    liskTransactionsRegisterDelegateStub.restore();
  });

  describe('listDelegates', () => {
    it('should return getDelegate(liskAPIClient, options) if options = {}', () => {
      const options = {};
      const response = { data: [] };
      liskAPIClientMockDelegates.expects('get').withArgs(options).returnsPromise().resolves(response);

      const returnedPromise = listDelegates(liskAPIClient, options);
      expect(returnedPromise).to.eventually.equal(response);
    });

    it('should return getDelegate(liskAPIClient, options) if options.q is set', () => {
      const options = { q: 'genesis_1' };
      const response = { data: [] };
      liskAPIClientMockDelegates.expects('get').withArgs(options).returnsPromise().resolves(response);

      const returnedPromise = listDelegates(liskAPIClient, options);
      return expect(returnedPromise).to.eventually.equal(response);
    });
  });

  describe('getDelegate', () => {
    it('should return getDelegate(liskAPIClient, options)', () => {
      const options = { publicKey: `"${accounts.delegate.publicKey}"` };
      const response = { data: [] };
      liskAPIClientMockDelegates.expects('get').withArgs(options).returnsPromise().resolves(response);

      const returnedPromise = getDelegate(liskAPIClient, options);
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

      vote({
        liskAPIClient,
        account: {
          ...accounts.genesis,
          loginType: loginType.normal,
        },
        votedList: votes,
        unvotedList: unvotes,
        secondPassphrase,
        timeOffset,
      });
      expect(liskAPIClient.transactions.broadcast).to.have.been.calledWith(transaction);
    });

    it('should call return error if account.loginType is not recognized', () => (
      expect(vote({
        liskAPIClient,
        account: {
          ...accounts.genesis,
          loginType: 'something unknown',
        },
      })).to.be.rejectedWith('Login Type not recognized.')
    ));
  });

  describe('getVotes', () => {
    it('should get votes for an address with no parameters', () => {
      const address = '123L';
      const offset = 0;
      const limit = 101;
      liskAPIClientMockVotes.expects('get').withArgs({ address, offset, limit }).once();
      getVotes(liskAPIClient, { address });
    });
  });

  describe('registerDelegate', () => {
    it('should broadcast a registerDelegate transaction without second passphrase', () => {
      const transaction = { id: '1234' };
      const username = 'username';
      const passphrase = 'passphrase';
      const secondPassphrase = undefined;

      liskTransactionsRegisterDelegateStub.withArgs({
        username,
        passphrase,
        timeOffset,
      }).returns(transaction);

      registerDelegate(liskAPIClient, username, passphrase, secondPassphrase, timeOffset);
      expect(liskAPIClient.transactions.broadcast).to.have.been.calledWith(transaction);
    });

    it('should broadcast a registerDelegate transaction with second passphrase', () => {
      const transaction = { id: '1234' };
      const username = 'username';
      const passphrase = 'passphrase';
      const secondPassphrase = 'secondPassphrase';

      liskTransactionsRegisterDelegateStub.withArgs({
        username,
        passphrase,
        secondPassphrase,
        timeOffset,
      }).returns(transaction);

      registerDelegate(liskAPIClient, username, passphrase, secondPassphrase, timeOffset);
      expect(liskAPIClient.transactions.broadcast).to.have.been.calledWith(transaction);
    });
  });
});
