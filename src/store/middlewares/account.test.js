import { expect } from 'chai';
import { spy, stub, useFakeTimers } from 'sinon';
import * as accountActions from '../../actions/account';
import * as transactionsActions from '../../actions/transactions';
import * as votingActions from '../../actions/voting';
import * as peersActions from '../../actions/peers';
import * as accountApi from '../../utils/api/account';
import * as transactionsApi from '../../utils/api/lsk/transactions';
import * as accountUtils from '../../utils/login';
import accounts from '../../../test/constants/accounts';
import networks from '../../constants/networks';
import settings from '../../constants/settings';
import actionTypes from '../../constants/actions';
import middleware from './account';
import transactionTypes from '../../constants/transactionTypes';

/* eslint-disable-next-line max-statements */
describe('Account middleware', () => {
  let store;
  let next;
  let state;
  let stubGetAccount;
  let stubTransactions;
  let transactionsActionsStub;
  let getAutoLogInDataMock;
  let liskAPIClientSetMock;
  let accountDataUpdatedSpy;
  const liskAPIClientMock = 'DUMMY_LISK_API_CLIENT';
  const storeCreatedAction = {
    type: actionTypes.storeCreated,
  };

  const { passphrase } = accounts.genesis;

  const transactions = { transactions: [{ senderId: 'sample_address', receiverId: 'some_address' }] };

  const transactionsUpdatedAction = {
    type: actionTypes.updateTransactions,
    data: {
      confirmed: [{
        type: transactionTypes.registerDelegate,
        confirmations: 1,
      }],
    },
  };

  const newBlockCreated = {
    type: actionTypes.newBlockCreated,
    data: {
      windowIsFocused: true,
      block: transactions,
    },
  };

  let clock;

  beforeEach(() => {
    clock = useFakeTimers(new Date('2017-12-29').getTime());
    store = stub();
    store.dispatch = spy();
    state = {
      peers: {
        liskAPIClient: {},
      },
      account: {
        address: 'sample_address',
      },
      transactions: {
        pending: [{
          id: 12498250891724098,
        }],
        confirmed: [],
        account: { address: 'test_address', balance: 0 },
      },
      delegate: {},
    };
    store.getState = () => (state);

    next = spy();
    spy(accountActions, 'updateTransactionsIfNeeded');
    spy(accountActions, 'updateDelegateAccount');
    stubGetAccount = stub(accountApi, 'getAccount').returnsPromise();
    transactionsActionsStub = spy(transactionsActions, 'updateTransactions');
    stubTransactions = stub(transactionsApi, 'getTransactions').returnsPromise().resolves(true);
    getAutoLogInDataMock = stub(accountUtils, 'getAutoLogInData');
    getAutoLogInDataMock.withArgs().returns({ });
    liskAPIClientSetMock = stub(peersActions, 'liskAPIClientSet').returns(liskAPIClientMock);
    accountDataUpdatedSpy = spy(accountActions, 'accountDataUpdated');
  });

  afterEach(() => {
    accountActions.updateDelegateAccount.restore();
    accountActions.updateTransactionsIfNeeded.restore();
    transactionsActionsStub.restore();
    stubGetAccount.restore();
    stubTransactions.restore();
    clock.restore();
    getAutoLogInDataMock.restore();
    liskAPIClientSetMock.restore();
    accountDataUpdatedSpy.restore();
  });

  it('should pass the action to next middleware', () => {
    middleware(store)(next)(newBlockCreated);
    expect(next).to.have.been.calledWith(newBlockCreated);
  });

  it(`should call account API methods on ${actionTypes.newBlockCreated} action when online`, () => {
    middleware(store)(next)(newBlockCreated);

    const data = {
      windowIsFocused: true,
      account: state.account,
      transactions: state.transactions,
    };

    clock.tick(7000);
    expect(accountDataUpdatedSpy).to.have.been.calledWith(data);
    expect(accountActions.updateTransactionsIfNeeded).to.have.been.calledWith();
  });

  it(`should call API methods on ${actionTypes.newBlockCreated} action if state.transaction.transactions.confirmed does not contain recent transaction. Case with transactions address`, () => {
    store.getState = () => ({
      ...state,
      transactions: {
        ...state.transactions,
        confirmed: [{ confirmations: 10 }],
        address: 'sample_address',
      },
    });

    middleware(store)(next)(newBlockCreated);

    clock.tick(7000);
    expect(accountDataUpdatedSpy).to.have.been.calledWith();
  });

  it(`should call API methods on ${actionTypes.newBlockCreated} action if state.transaction.transactions.confirmed does not contain recent transaction. Case with confirmed address`, () => {
    store.getState = () => ({
      ...state,
      transactions: {
        pending: [{
          id: 12498250891724098,
        }],
        confirmed: [{ confirmations: 10, address: 'sample_address' }],
      },
      peers: { liskAPIClient: {} },
    });

    middleware(store)(next)(newBlockCreated);

    clock.tick(7000);
    expect(accountDataUpdatedSpy).to.have.been.calledWith();
  });

  it(`should fetch delegate info on ${actionTypes.updateTransactions} action if action.data.confirmed contains delegateRegistration transactions`, () => {
    middleware(store)(next)(transactionsUpdatedAction);
    expect(accountActions.updateDelegateAccount).to.have.been.calledWith();
  });

  it(`should not fetch delegate info on ${actionTypes.updateTransactions} action if action.data.confirmed does not contain delegateRegistration transactions`, () => {
    transactionsUpdatedAction.data.confirmed[0].type = transactionTypes.send;

    middleware(store)(next)(transactionsUpdatedAction);
    expect(store.dispatch).to.not.have.been.calledWith();
  });

  it(`should dispatch ${actionTypes.loadVotes} action on ${actionTypes.updateTransactions} action if action.data.confirmed contains delegateRegistration transactions`, () => {
    const actionSpy = spy(votingActions, 'loadVotes');
    transactionsUpdatedAction.data.confirmed[0].type = transactionTypes.vote;
    middleware(store)(next)(transactionsUpdatedAction);
    expect(actionSpy).to.have.been.calledWith({
      address: state.account.address,
      type: 'update',
    });
  });

  it(`should dispatch ${actionTypes.liskAPIClientSet} action on ${actionTypes.storeCreated} if autologin data found in localStorage`, () => {
    getAutoLogInDataMock.withArgs().returns({
      [settings.keys.loginKey]: passphrase,
      [settings.keys.liskCoreUrl]: networks.testnet.nodes[0],
    });
    middleware(store)(next)(storeCreatedAction);
    expect(store.dispatch).to.have.been.calledWith(liskAPIClientMock);
  });

  it(`should do nothing on ${actionTypes.storeCreated} if autologin data NOT found in localStorage`, () => {
    middleware(store)(next)(storeCreatedAction);
    expect(store.dispatch).to.not.have.been.calledWith(liskAPIClientMock);
  });

  it(`should update account data on ${actionTypes.accountLoggedIn} `, () => {
    const accountLoggedInAction = {
      type: actionTypes.accountLoggedIn,
      data: {
      },
    };
    middleware(store)(next)(accountLoggedInAction);
    expect(store.dispatch).to.have.been.calledWith({ type: actionTypes.walletUpdated, data: {} });
  });

  it(`should clean up on ${actionTypes.accountLoggedOut} `, () => {
    const accountLoggedOutAction = {
      type: actionTypes.accountLoggedOut,
    };
    middleware(store)(next)(accountLoggedOutAction);
    expect(store.dispatch).to.have.been.calledWith({ type: actionTypes.cleanTransactions });
  });
});
