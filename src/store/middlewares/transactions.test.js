import { expect } from 'chai';
import { spy, stub, mock } from 'sinon';
import * as accountApi from '../../utils/api/account';
import * as delegateApi from '../../utils/api/delegate';
import { transactionsFailed, transactionLoaded, transactionLoadFailed, transactionsInit } from '../../actions/transactions';
import middleware from './transactions';
import actionTypes from '../../constants/actions';
import accounts from '../../../test/constants/accounts';

describe('transaction middleware', () => {
  let store;
  let next;
  let state;
  let accountApiMock;
  let delegateApiMock;
  const mockTransaction = {
    username: 'test',
    amount: 1e8,
    recipientId: '16313739661670634666L',
  };

  beforeEach(() => {
    store = stub();
    state = {
      peers: {
        data: {},
      },
      account: {
        address: '8096217735672704724L',
      },
      transactions: {
        pending: [],
      },
      savedAccounts: {
        lastActive: {
          address: '8096217735672704724L',
        },
      },
    };
    store.getState = () => (state);
    store.dispatch = spy();
    next = spy();
    accountApiMock = mock(accountApi);
    delegateApiMock = mock(delegateApi);
  });

  afterEach(() => {
    accountApiMock.restore();
    delegateApiMock.restore();
  });

  it('should passes the action to next middleware', () => {
    const givenAction = {
      type: 'TEST_ACTION',
    };

    middleware(store)(next)(givenAction);
    expect(next).to.have.been.calledWith(givenAction);
  });

  it('should do nothing if state.transactions.pending.length === 0 and action.type is transactionsUpdated', () => {
    const givenAction = {
      type: actionTypes.transactionsUpdated,
      data: [mockTransaction],
    };

    middleware(store)(next)(givenAction);
    expect(store.dispatch).to.not.have.been.calledWith();
  });

  it('should load one transaction action.type is transactionLoadRequested', () => {
    accountApiMock.expects('transaction').returnsPromise().resolves(mockTransaction);

    const givenAction = {
      type: actionTypes.transactionLoadRequested,
      data: { id: '1345' },
    };

    middleware(store)(next)(givenAction);
    expect(store.dispatch).to.have.been.calledWith(transactionLoaded({ ...mockTransaction }));
  });

  it('should catch if transaction was not found', () => {
    const error = { success: false, error: 'Transaction not found' };
    accountApiMock.expects('transaction').returnsPromise().rejects(error);

    const givenAction = {
      type: actionTypes.transactionLoadRequested,
      data: { id: '1345' },
    };

    middleware(store)(next)(givenAction);
    expect(store.dispatch).to.have.been.calledWith(transactionLoadFailed({ error }));
  });


  it('should fetch delegate info if account is not the active account', () => {
    const delegateCandidateData = accounts['delegate candidate'];
    const genesisAccountData = accounts.genesis;
    accountApiMock.expects('transactions').returnsPromise().resolves({ transactions: [mockTransaction], count: 1 });
    accountApiMock.expects('getAccount').returnsPromise().resolves(genesisAccountData);
    delegateApiMock.expects('getDelegate').returnsPromise().resolves({ delegate: delegateCandidateData });

    const givenAction = {
      type: actionTypes.transactionsRequestInit,
      data: {
        id: '1345',
        address: delegateCandidateData.address,
      },
    };

    const expectedCallArgs = {
      confirmed: [mockTransaction],
      count: 1,
      balance: genesisAccountData.balance,
      address: delegateCandidateData.address,
      targetDelegate: {
        ...delegateCandidateData,
      },
    };

    middleware(store)(next)(givenAction);
    expect(store.dispatch).to.have.been
      .calledWith(transactionsInit(expectedCallArgs));
  });

  it('should not fetch delegate info if account is the active account and isDelegate', () => {
    const delegateCandidateData = accounts['delegate candidate'];
    accountApiMock.expects('transactions').returnsPromise().resolves({ transactions: [mockTransaction], count: 1 });
    accountApiMock.expects('getAccount').returnsPromise().resolves({
      ...delegateCandidateData,
      isDelegate: true,
      delegate: { ...delegateCandidateData },
    });
    delegateApiMock.expects('getDelegate').returnsPromise().resolves({ delegate: delegateCandidateData });

    store.getState = () => ({
      ...state,
      account: { address: delegateCandidateData.address },
    });

    const givenAction = {
      type: actionTypes.transactionsRequestInit,
      data: {
        id: '1345',
        address: delegateCandidateData.address,
      },
    };

    const expectedCallArgs = {
      confirmed: [mockTransaction],
      count: 1,
      balance: delegateCandidateData.balance,
      address: delegateCandidateData.address,
      targetDelegate: {
        ...delegateCandidateData,
      },
    };

    middleware(store)(next)(givenAction);
    expect(store.dispatch).to.have.been
      .calledWith(transactionsInit(expectedCallArgs));
  });

  it('should finish loading transactions when no delegate found for account', () => {
    const delegateAccountData = accounts['delegate candidate'];
    accountApiMock.expects('transactions').returnsPromise().resolves({ transactions: [mockTransaction], count: 1 });
    accountApiMock.expects('getAccount').returnsPromise().resolves(delegateAccountData);
    delegateApiMock.expects('getDelegate').returnsPromise().rejects(true);

    store.getState = () => ({
      ...state,
      account: { address: delegateAccountData.address },
    });

    const givenAction = {
      type: actionTypes.transactionsRequestInit,
      data: {
        id: '1345',
        address: delegateAccountData.address,
      },
    };

    const expectedCallArgsNoDelegate = {
      confirmed: [mockTransaction],
      count: 1,
      balance: delegateAccountData.balance,
      address: delegateAccountData.address,
    };

    middleware(store)(next)(givenAction);
    expect(store.dispatch).to.have.been
      .calledWith(transactionsInit(expectedCallArgsNoDelegate));
  });

  it('should call unconfirmedTransactions and then dispatch transactionsFailed if state.transactions.pending.length > 0 and action.type is transactionsUpdated', () => {
    const transactions = [
      mockTransaction,
    ];
    accountApiMock.expects('unconfirmedTransactions')
      .withExactArgs(state.peers.data, state.account.address)
      .returnsPromise().resolves({ transactions });
    store.getState = () => ({
      ...state,
      transactions: {
        pending: transactions,
      },
    });
    const givenAction = {
      type: actionTypes.transactionsUpdated,
      data: [],
    };

    middleware(store)(next)(givenAction);
    const expectedAction = transactionsFailed({ failed: [] });
    expect(store.dispatch).to.have.been.calledWith(expectedAction);
  });
});
