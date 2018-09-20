import { expect } from 'chai';
import { spy, stub, useFakeTimers } from 'sinon';
import * as accountActions from '../../actions/account';
import * as transactionsActions from '../../actions/transactions';
import accountConfig from '../../constants/account';
import * as votingActions from '../../actions/voting';
import * as peersActions from '../../actions/peers';
import * as accountApi from '../../utils/api/account';
import * as transactionsApi from '../../utils/api/transactions';
import * as accountUtils from '../../utils/login';
import accounts from '../../../test/constants/accounts';
import networks from '../../constants/networks';
import settings from '../../constants/settings';
import actionTypes from '../../constants/actions';
import middleware from './account';
import transactionTypes from '../../constants/transactionTypes';

describe('Account middleware', () => {
  const { lockDuration } = accountConfig;
  let store;
  let next;
  let state;
  let stubGetAccount;
  let stubTransactions;
  let transactionsActionsStub;
  let getAutoLogInDataMock;
  let activePeerSetMock;
  let accountDataUpdatedSpy;
  const activePeerMock = 'DUMMY_ACTIVE_PEER';
  const storeCreatedAction = {
    type: actionTypes.storeCreated,
  };

  const { passphrase } = accounts.genesis;

  const transactions = { transactions: [{ senderId: 'sample_address', receiverId: 'some_address' }] };

  const transactionsUpdatedAction = {
    type: actionTypes.transactionsUpdated,
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
        data: {},
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
    transactionsActionsStub = spy(transactionsActions, 'transactionsUpdated');
    stubTransactions = stub(transactionsApi, 'getTransactions').returnsPromise().resolves(true);
    getAutoLogInDataMock = stub(accountUtils, 'getAutoLogInData');
    getAutoLogInDataMock.withArgs().returns({ });
    activePeerSetMock = stub(peersActions, 'activePeerSet').returns(activePeerMock);
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
    activePeerSetMock.restore();
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
      peers: { data: {} },
    });

    middleware(store)(next)(newBlockCreated);

    clock.tick(7000);
    expect(accountDataUpdatedSpy).to.have.been.calledWith();
  });

  it(`should fetch delegate info on ${actionTypes.transactionsUpdated} action if action.data.confirmed contains delegateRegistration transactions`, () => {
    middleware(store)(next)(transactionsUpdatedAction);
    expect(accountActions.updateDelegateAccount).to.have.been.calledWith();
  });

  it(`should not fetch delegate info on ${actionTypes.transactionsUpdated} action if action.data.confirmed does not contain delegateRegistration transactions`, () => {
    transactionsUpdatedAction.data.confirmed[0].type = transactionTypes.send;

    middleware(store)(next)(transactionsUpdatedAction);
    expect(store.dispatch).to.not.have.been.calledWith();
  });

  it(`should dispatch ${actionTypes.votesFetched} action on ${actionTypes.transactionsUpdated} action if action.data.confirmed contains delegateRegistration transactions`, () => {
    const actionSpy = spy(votingActions, 'votesFetched');
    transactionsUpdatedAction.data.confirmed[0].type = transactionTypes.vote;
    middleware(store)(next)(transactionsUpdatedAction);
    expect(actionSpy).to.have.been.calledWith({
      address: state.account.address,
      type: 'update',
    });
  });

  it(`should dispatch accountUpdated({passphrase}) action on ${actionTypes.passphraseUsed} action if store.account.passphrase is not set`, () => {
    const accountUpdatedSpy = spy(accountActions, 'accountUpdated');

    const action = {
      type: actionTypes.passphraseUsed,
      data: passphrase,
    };
    middleware(store)(next)(action);
    expect(accountUpdatedSpy).to.have.been.calledWith({
      passphrase,
      expireTime: clock.now + lockDuration,
    });
    accountUpdatedSpy.restore();
  });

  it(`should not dispatch accountUpdated action on ${actionTypes.passphraseUsed} action if store.account.passphrase is already set`, () => {
    const accountUpdatedSpy = spy(accountActions, 'accountUpdated');
    const action = {
      type: actionTypes.passphraseUsed,
      data: passphrase,
    };
    store.getState = () => ({
      ...state,
      account: { ...state.account, passphrase, expireTime: clock.now + lockDuration },
    });

    middleware(store)(next)(action);
    expect(accountUpdatedSpy).to.have.been.calledWith({ expireTime: clock.now + lockDuration });
    accountUpdatedSpy.restore();
  });

  it(`should dispatch ${actionTypes.activePeerSet} action on ${actionTypes.storeCreated} if autologin data found in localStorage`, () => {
    getAutoLogInDataMock.withArgs().returns({
      [settings.keys.autologinKey]: passphrase,
      [settings.keys.autologinUrl]: networks.testnet.nodes[0],
    });
    middleware(store)(next)(storeCreatedAction);
    expect(store.dispatch).to.have.been.calledWith(activePeerMock);
  });

  it(`should do nothing on ${actionTypes.storeCreated} if autologin data NOT found in localStorage`, () => {
    middleware(store)(next)(storeCreatedAction);
    expect(store.dispatch).to.not.have.been.calledWith(activePeerMock);
  });
});
