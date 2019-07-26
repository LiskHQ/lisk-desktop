import Lisk from '@liskhq/lisk-client';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  castVotes,
  getDelegateByName,
  getDelegates,
  getVotes,
  registerDelegate,
} from './delegates';
import { loginType } from '../../constants/hwConstants';
import accounts from '../../../test/constants/accounts';
import delegates from '../../../test/constants/delegates';
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

  describe('getDelegateByName', () => {
    it('should resolve delegate genesis_3 if name = genesis_3', () => {
      const name = delegates[0].username;
      liskAPIClientMockDelegates.expects('get').withArgs({
        search: name, limit: 101,
      }).returnsPromise().resolves({ data: delegates });

      const returnedPromise = getDelegateByName(liskAPIClient, name);
      expect(returnedPromise).to.eventually.equal(delegates[0]);
    });

    it('should reject if given name does not exist', () => {
      const name = `${delegates[0].username}_not_exist`;
      liskAPIClientMockDelegates.expects('get').withArgs({
        search: name, limit: 101,
      }).returnsPromise().resolves({ data: [] });

      const returnedPromise = getDelegateByName(liskAPIClient, name);
      expect(returnedPromise).to.be.rejectedWith();
    });
  });

  describe('castVotes', () => {
    it('should call castVotes and broadcast transaction', () => {
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
