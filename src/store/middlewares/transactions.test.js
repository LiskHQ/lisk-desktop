import { expect } from 'chai';
import { spy, stub, mock } from 'sinon';
import i18next from 'i18next';
import * as accountApi from '../../utils/api/account';
import { successAlertDialogDisplayed } from '../../actions/dialog';
import { transactionsFailed } from '../../actions/transactions';
import middleware from './transactions';
import actionTypes from '../../constants/actions';

describe('transaction middleware', () => {
  let store;
  let next;
  let state;
  let accountApiMock;
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
    };
    store.getState = () => (state);
    store.dispatch = spy();
    next = spy();
    accountApiMock = mock(accountApi);
  });

  afterEach(() => {
    accountApiMock.restore();
  });

  it('should passes the action to next middleware', () => {
    const givenAction = {
      type: 'TEST_ACTION',
    };

    middleware(store)(next)(givenAction);
    expect(next).to.have.been.calledWith(givenAction);
  });

  it('should fire success dialog action with appropriate text if action.type is transactionAdded', () => {
    const givenAction = {
      type: actionTypes.transactionAdded,
      data: mockTransaction,
    };

    const expectedMessages = [
      'Second passphrase registration was successfully submitted. It can take several seconds before it is processed.',
      'Delegate registration was successfully submitted with username: "test". It can take several seconds before it is processed.',
      'Your votes were successfully submitted. It can take several seconds before they are processed.',
    ];

    for (let i = 0; i < 3; i++) {
      givenAction.data.type = i + 1;
      middleware(store)(next)(givenAction);
      const expectedAction = successAlertDialogDisplayed({ text: i18next.t(expectedMessages[i]) });
      expect(store.dispatch).to.have.been.calledWith(expectedAction);
    }
  });

  it('should do nothing if state.transactions.pending.length === 0 and action.type is transactionsUpdated', () => {
    const givenAction = {
      type: actionTypes.transactionsUpdated,
      data: [mockTransaction],
    };

    middleware(store)(next)(givenAction);
    expect(store.dispatch).to.not.have.been.calledWith();
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

