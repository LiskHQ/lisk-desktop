import Lisk from '@liskhq/lisk-client';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  getDelegateInfo,
  getDelegates,
  getVotes,
  registerDelegate,
} from './delegates';
import { loginType } from '../../constants/hwConstants';
import accounts from '../../../test/constants/accounts';
import delegates from '../../../test/constants/delegates';
import * as hwManager from '../hwManager';

describe('Utils: Delegate', () => {
  let liskAPIClientMockDelegates;
  let liskAPIClientMockVotes;
  let liskAPIClientMockTransations;
  let liskTransactionsCastVotesStub;
  let liskTransactionsRegisterDelegateStub;
  let signVoteTransaction;
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
      get: () => Promise.resolve({ data: [] }),
    },
    blocks: {
      get: () => Promise.resolve({ data: [] }),
    },
    network: {
      name: 'Testnet',
    },
  };

  beforeEach(() => {
    liskTransactionsCastVotesStub = sinon.stub(Lisk.transaction, 'castVotes');
    liskTransactionsRegisterDelegateStub = sinon.stub(Lisk.transaction, 'registerDelegate');
    liskAPIClientMockDelegates = sinon.mock(liskAPIClient.delegates);
    liskAPIClientMockVotes = sinon.mock(liskAPIClient.votes);
    liskAPIClientMockTransations = sinon.stub(liskAPIClient.transactions, 'broadcast').resolves({ id: '1234' });
    sinon.stub(liskAPIClient.transactions, 'get');
    signVoteTransaction = sinon.stub(hwManager, 'signVoteTransaction').resolves([{ id: '1234' }]);
  });

  afterEach(() => {
    liskAPIClientMockDelegates.verify();
    liskAPIClientMockDelegates.restore();

    liskAPIClientMockVotes.verify();
    liskAPIClientMockVotes.restore();

    liskAPIClientMockTransations.restore();

    liskTransactionsCastVotesStub.restore();
    liskTransactionsRegisterDelegateStub.restore();

    liskAPIClient.transactions.get.restore();
    signVoteTransaction.restore();
    localStorage.clear();
  });

  describe('getDelegates', () => {
    it.skip('should return getDelegates(liskAPIClient, options) if options = {}', () => {
      const options = {};
      const response = { data: [] };
      liskAPIClientMockDelegates.expects('get').withArgs(options).resolves(response);

      const returnedPromise = getDelegates(liskAPIClient, options);
      expect(returnedPromise).to.eventually.equal(response);
    });

    it.skip('should return getDelegates(liskAPIClient, options) if options.q is set', () => {
      const options = { q: 'genesis_1' };
      const response = { data: [] };
      liskAPIClientMockDelegates.expects('get').withArgs(options).resolves(response);

      const returnedPromise = getDelegates(liskAPIClient, options);
      return expect(returnedPromise).to.eventually.equal(response);
    });
  });

  describe('getDelegateByInfo', () => {
    it.skip('should resolve delegate object with lastBlock and txDelegateRegister', () => {
      const delegate = delegates[0];
      const { address } = delegate.account;
      liskAPIClientMockDelegates.expects('get').withArgs({ address })
        .resolves({ data: [delegate] });

      const txDelegateRegister = { id: '091241204970', timestamp: '14023472398' };
      liskAPIClient.transactions.get.resolves({ data: [txDelegateRegister] });

      return expect(getDelegateInfo(liskAPIClient, { address })).to.eventually.deep.equal({
        ...delegate,
        lastBlock: '-',
        txDelegateRegister,
      });
    });

    it.skip('should reject if delegate not found', () => {
      const { address } = accounts.genesis;
      liskAPIClientMockDelegates.expects('get').withArgs({ address })
        .resolves({ data: [] });

      return expect(getDelegateInfo(liskAPIClient, { address })).to.eventually.be.rejectedWith(
        `"${address}" is not a delegate`,
      );
    });
  });

  describe('getVotes', () => {
    it.skip('should get votes for an address with no parameters', () => {
      const address = '123L';
      const offset = 0;
      const limit = 101;
      liskAPIClientMockVotes.expects('get').withArgs({ address, offset, limit }).once();
      getVotes(liskAPIClient, { address });
    });
  });

  describe('registerDelegate', () => {
    it.skip('should broadcast a registerDelegate transaction without second passphrase', () => {
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

    it.skip('should broadcast a registerDelegate transaction with second passphrase', () => {
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

  describe('castVotes', () => {
    it.skip('should call castVotes and broadcast transaction regular login', async () => {
      const votes = [
        accounts.genesis.publicKey,
        accounts.delegate.publicKey,
      ];
      const unvotes = [
        accounts.empty_account.publicKey,
        accounts.delegate_candidate.publicKey,
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

      await castVotes({
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

    it.skip('should call castVotes and broadcast transaction with hardware wallet', async () => {
      const votes = [
        accounts.genesis.publicKey,
        accounts.delegate.publicKey,
      ];
      const unvotes = [
        accounts.empty_account.publicKey,
        accounts.delegate_candidate.publicKey,
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

      await castVotes({
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
      expect(liskAPIClient.transactions.broadcast).to.have.been.calledWith(transaction);
    });
  });
});
