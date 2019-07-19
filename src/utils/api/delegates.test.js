import { expect } from 'chai';
import sinon from 'sinon';
import Lisk from '@liskhq/lisk-client';
import {
  getDelegates,
  castVotes,
  getVotes,
  registerDelegate,
} from './delegates';
import accounts from '../../../test/constants/accounts';
import { loginType } from '../../constants/hwConstants';
import * as hwWallet from './hwWallet';

describe('Utils: Delegate', () => {
  let liskAPIClientMockDelegates;
  let liskAPIClientMockVotes;
  let liskAPIClientMockTransations;
  let liskTransactionsCastVotesStub;
  let liskTransactionsRegisterDelegateStub;
  let voteWithHWStub;
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
    voteWithHWStub = sinon.stub(hwWallet, 'voteWithHW');
  });

  afterEach(() => {
    liskAPIClientMockDelegates.verify();
    liskAPIClientMockDelegates.restore();

    liskAPIClientMockVotes.verify();
    liskAPIClientMockVotes.restore();

    liskAPIClientMockTransations.restore();

    liskTransactionsCastVotesStub.restore();
    liskTransactionsRegisterDelegateStub.restore();
    voteWithHWStub.restore();
  });

  describe('getDelegates', () => {
    it('should return getDelegates(liskAPIClient, options) if options = {}', () => {
      const options = {};
      const response = { data: [] };
      liskAPIClientMockDelegates.expects('get').withArgs(options).returnsPromise().resolves(response);

      const returnedPromise = getDelegates(liskAPIClient, options);
      expect(returnedPromise).to.eventually.equal(response);
    });

    it('should return getDelegates(liskAPIClient, options) if options.q is set', () => {
      const options = { q: 'genesis_1' };
      const response = { data: [] };
      liskAPIClientMockDelegates.expects('get').withArgs(options).returnsPromise().resolves(response);

      const returnedPromise = getDelegates(liskAPIClient, options);
      return expect(returnedPromise).to.eventually.equal(response);
    });
  });

  describe('castVotes', () => {
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

      castVotes({
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

      castVotes({
        liskAPIClient,
        account: {
          ...accounts.genesis,
          loginType: loginType.ledger,
        },
        votedList: votes,
        unvotedList: unvotes,
        secondPassphrase,
        timeOffset,
      });
      expect(voteWithHWStub).to.have.been.calledWith();
    });

    it('should call return error if account.loginType is not recognized', () => (
      expect(castVotes({
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
