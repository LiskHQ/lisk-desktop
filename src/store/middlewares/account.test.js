import { expect } from 'chai';
import {
  spy, stub, useFakeTimers, match,
} from 'sinon';
import * as accountActions from '../../actions/account';
import * as transactionsActions from '../../actions/transactions';
import * as votingActions from '../../actions/voting';
import * as networkActions from '../../actions/network';
import * as accountApi from '../../utils/api/account';
import * as transactionsApi from '../../utils/api/lsk/transactions';
import * as accountUtils from '../../utils/login';
import accounts from '../../../test/constants/accounts';
import networks from '../../constants/networks';
import settings from '../../constants/settings';
import actionTypes from '../../constants/actions';
import middleware from './account';
import transactionTypes from '../../constants/transactionTypes';

describe('Account middleware', () => {
  let store;
  let next;
  let state;
  let stubGetAccount;
  let stubTransactions;
  let getAutoLogInDataMock;
  let networkSetMock;
  let accountDataUpdatedSpy;
  let windowNotificationSpy;
  const liskAPIClientMock = 'DUMMY_LISK_API_CLIENT';
  const storeCreatedAction = {
    type: actionTypes.storeCreated,
  };

  const { passphrase } = accounts.genesis;

  const block = {
    transactions: [
      {
        senderId: 'some_address',
        recipientId: 'sample_address',
        asset: { data: 'Message' },
        amount: 10e8,
      },
      {
        senderId: 'some_address',
        recipientId: 'sample_address',
        asset: { data: '' },
        amount: 10e8,
      },
    ],
  };

  const transactionsUpdatedAction = {
    type: actionTypes.updateTransactions,
    data: {
      confirmed: [{
        type: transactionTypes().registerDelegate.code,
        confirmations: 1,
      }],
    },
  };

  const newBlockCreated = {
    type: actionTypes.newBlockCreated,
    data: {
      windowIsFocused: true,
      block,
    },
  };

  let clock;

  beforeEach(() => {
    clock = useFakeTimers(new Date('2017-12-29').getTime());
    store = stub();
    store.dispatch = spy();
    state = {
      network: {
        status: { online: true },
        name: 'Custom Node',
        networks: {
          LSK: {
            nodeUrl: 'hhtp://localhost:4000',
            nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
          },
        },
      },
      account: {
        address: 'sample_address',
        info: {
          LSK: {
            address: 'sample_address',
          },
        },
      },
      transactions: {
        pending: [{
          id: 12498250891724098,
        }],
        confirmed: [],
        account: { address: 'test_address', balance: 0 },
      },
      delegate: {},
      settings: { token: { active: 'LSK' }, statistics: false },
    };
    store.getState = () => (state);

    next = spy();
    spy(transactionsActions, 'updateTransactions');
    spy(accountActions, 'updateEnabledTokenAccount');
    stubGetAccount = stub(accountApi, 'getAccount').returnsPromise();
    stubTransactions = stub(transactionsApi, 'getTransactions').returnsPromise().resolves(true);
    getAutoLogInDataMock = stub(accountUtils, 'getAutoLogInData');
    getAutoLogInDataMock.withArgs().returns({ });
    networkSetMock = stub(networkActions, 'networkSet').returns(liskAPIClientMock);
    accountDataUpdatedSpy = spy(accountActions, 'accountDataUpdated');
    window.Notification = () => { };
    windowNotificationSpy = spy(window, 'Notification');
  });

  afterEach(() => {
    transactionsActions.updateTransactions.restore();
    accountActions.updateEnabledTokenAccount.restore();
    stubGetAccount.restore();
    stubTransactions.restore();
    clock.restore();
    getAutoLogInDataMock.restore();
    networkSetMock.restore();
    accountDataUpdatedSpy.restore();
    windowNotificationSpy.restore();
  });

  it('should pass the action to next middleware', () => {
    middleware(store)(next)(newBlockCreated);
    expect(next).to.have.been.calledWith(newBlockCreated);
  });

  it(`should call account API methods on ${actionTypes.newBlockCreated} action when online`, () => {
    middleware(store)(next)(newBlockCreated);

    const data = {
      account: state.account,
      transactions: state.transactions,
    };

    clock.tick(7000);
    expect(accountDataUpdatedSpy).to.have.been.calledWith(data);
    expect(transactionsActions.updateTransactions).to.have.been.calledWith();
  });

  it(`should call account BTC API methods on ${actionTypes.newBlockCreated} action when BTC is the active token`, () => {
    state.settings = { token: { active: 'BTC' } };
    const address = 'n45uoyzDvep8cwgkfxq3H3te1ujWyu1kkB';
    state.account = { address };
    state.transactions.confirmed = [{ senderId: address, confirmations: 1 }];
    middleware(store)(next)(newBlockCreated);

    clock.tick(7000);
    expect(transactionsActions.updateTransactions)
      .to.have.been.calledWith(match({ address }));
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
      network: {
        status: { online: true },
        name: 'Custom Node',
        networks: {
          LSK: {
            nodeUrl: 'hhtp://localhost:4000',
            nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
          },
        },
      },
    });

    middleware(store)(next)(newBlockCreated);

    clock.tick(7000);
    expect(accountDataUpdatedSpy).to.have.been.calledWith();
  });

  it('should show Notification on incoming transaction', () => {
    middleware(store)(next)(newBlockCreated);
    expect(windowNotificationSpy).to.have.been.calledWith('10 LSK Recieved');
  });

  it(`should dispatch ${actionTypes.loadVotes} action on ${actionTypes.updateTransactions} action if action.data.confirmed contains delegateRegistration transactions`, () => {
    const actionSpy = spy(votingActions, 'loadVotes');
    transactionsUpdatedAction.data.confirmed[0].type = transactionTypes().vote.code;
    middleware(store)(next)(transactionsUpdatedAction);
    expect(actionSpy).to.have.been.calledWith({
      address: state.account.address,
      type: 'update',
    });
  });

  it(`should dispatch ${actionTypes.networkSet} action on ${actionTypes.storeCreated} if autologin data found in localStorage`, async () => {
    getAutoLogInDataMock.withArgs().returns({
      [settings.keys.loginKey]: passphrase,
      [settings.keys.liskCoreUrl]: networks.testnet.nodes[0],
    });
    await middleware(store)(next)(storeCreatedAction);
    expect(store.dispatch).to.have.been.calledWith();
  });

  it(`should do nothing on ${actionTypes.storeCreated} if autologin data NOT found in localStorage`, () => {
    middleware(store)(next)(storeCreatedAction);
    expect(store.dispatch).to.not.have.been.calledWith(liskAPIClientMock);
  });

  it(`should dispatch ${actionTypes.networkSet} on ${actionTypes.storeCreated} if settings with network found in localStorage`, async () => {
    localStorage.setItem('settings', JSON.stringify({
      network: 'Testnet',
    }));
    await middleware(store)(next)(storeCreatedAction);
    expect(store.dispatch).to.have.been.calledWith(liskAPIClientMock);
  });

  it(`should clean up on ${actionTypes.accountLoggedOut} `, () => {
    const accountLoggedOutAction = {
      type: actionTypes.accountLoggedOut,
    };
    middleware(store)(next)(accountLoggedOutAction);
    expect(store.dispatch).to.have.been.calledWith({ type: actionTypes.emptyTransactionsData });
  });

  it(`should update logged accounts on ${actionTypes.settingsUpdated} with enabled tokens`, async () => {
    const settingsUpdatedAction = {
      type: actionTypes.settingsUpdated,
      data: { token: { list: { BTC: true } } },
    };
    middleware(store)(next)(settingsUpdatedAction);
    expect(accountActions.updateEnabledTokenAccount).to.have.been.calledWith('BTC');
    expect(store.dispatch).to.have.been.calledWith();
  });
});
