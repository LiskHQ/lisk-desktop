import * as accountActions from '../../actions/account';
import * as transactionsActions from '../../actions/transactions';
import * as votingActions from '../../actions/voting';
import * as networkActions from '../../actions/network';
import * as settingsActions from '../../actions/settings';
import * as accountUtils from '../../utils/login';
import accounts from '../../../test/constants/accounts';
import networks from '../../constants/networks';
import settings from '../../constants/settings';
import actionTypes from '../../constants/actions';
import middleware from './account';
import transactionTypes from '../../constants/transactionTypes';
import { tokenMap } from '../../constants/tokens';

describe('Account middleware', () => {
  let store;
  let next;
  let state;
  let getAutoLogInDataMock;
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
        type: 0,
      },
      {
        senderId: 'some_address',
        recipientId: 'sample_address',
        asset: { data: '' },
        amount: 10e8,
        type: 0,
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


  beforeEach(() => {
    jest.useFakeTimers();
    store = jest.fn();
    store.dispatch = jest.fn();
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

    next = jest.fn();
    jest.spyOn(transactionsActions, 'updateTransactions');
    jest.spyOn(accountActions, 'updateEnabledTokenAccount');
    jest.spyOn(networkActions, 'networkSet').mockImplementation(() => liskAPIClientMock);
    getAutoLogInDataMock = jest.spyOn(accountUtils, 'getAutoLogInData').mockImplementation(() => ({}));
    accountDataUpdatedSpy = jest.spyOn(accountActions, 'accountDataUpdated');
    window.Notification = () => { };
    windowNotificationSpy = jest.spyOn(window, 'Notification');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should pass the action to next middleware', () => {
    middleware(store)(next)(newBlockCreated);
    expect(next).toHaveBeenCalledWith(newBlockCreated);
  });

  it(`should call account API methods on ${actionTypes.newBlockCreated} action when online`, () => {
    middleware(store)(next)(newBlockCreated);

    const data = {
      account: state.account,
      transactions: state.transactions,
    };

    jest.advanceTimersByTime(7000);
    expect(accountDataUpdatedSpy).toHaveBeenCalledWith(data);
    expect(transactionsActions.updateTransactions).toHaveBeenCalledWith({
      pendingTransactions: data.transactions.pending,
      address: data.account.address,
      filters: undefined,
    });
  });

  it(`should call account BTC API methods on ${actionTypes.newBlockCreated} action when BTC is the active token`, () => {
    state.settings = { token: { active: 'BTC' } };
    const address = 'n45uoyzDvep8cwgkfxq3H3te1ujWyu1kkB';
    state.account = { address };
    state.transactions.confirmed = [{ senderId: address, confirmations: 1 }];
    middleware(store)(next)(newBlockCreated);

    jest.advanceTimersByTime(7000);
    expect(transactionsActions.updateTransactions)
      .toHaveBeenCalledWith({
        address, filters: undefined, pendingTransactions: state.transactions.pending,
      });
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
    const currentState = store.getState();

    middleware(store)(next)(newBlockCreated);

    jest.advanceTimersByTime(7000);
    expect(accountDataUpdatedSpy).toHaveBeenCalledWith({
      account: currentState.account,
      transactions: currentState.transactions,
    });
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
    const currentState = store.getState();

    middleware(store)(next)(newBlockCreated);

    jest.advanceTimersByTime(7000);
    expect(accountDataUpdatedSpy).toHaveBeenCalledWith({
      account: currentState.account,
      transactions: currentState.transactions,
    });
  });

  it.skip('should show Notification on incoming transaction', () => {
    middleware(store)(next)(newBlockCreated);
    expect(windowNotificationSpy).nthCalledWith(
      1,
      '10 LSK Received',
      {
        body:
        'Your account just received 10 LSK with message Message',
      },
    );
  });

  it(`should dispatch ${actionTypes.votesRetrieved} action on ${actionTypes.updateTransactions} action if action.data.confirmed contains delegateRegistration transactions`, () => {
    const actionSpy = jest.spyOn(votingActions, 'votesRetrieved');
    transactionsUpdatedAction.data.confirmed[0].type = transactionTypes().vote.code.legacy;
    middleware(store)(next)(transactionsUpdatedAction);
    expect(actionSpy).toHaveBeenCalledWith({
      address: state.account.address,
      type: 'update',
    });
  });

  it(`should dispatch ${actionTypes.networkSet} action on ${actionTypes.storeCreated} if autologin data found in localStorage`, () => {
    getAutoLogInDataMock.mockImplementation(() => ({
      [settings.keys.loginKey]: passphrase,
      [settings.keys.liskCoreUrl]: networks.testnet.nodes[0],
    }));
    jest.spyOn(networkActions, 'networkSet');

    middleware(store)(next)(storeCreatedAction);
    expect(networkActions.networkSet).toHaveBeenCalled();
  });

  it.skip(`should do nothing on ${actionTypes.storeCreated} if autologin data NOT found in localStorage`, () => {
    middleware(store)(next)(storeCreatedAction);
    expect(store.dispatch).not.toHaveBeenCalledTimes(liskAPIClientMock);
  });

  it(`should dispatch ${actionTypes.networkSet} on ${actionTypes.storeCreated} if settings with network found in localStorage`, () => {
    localStorage.setItem('settings', JSON.stringify({
      network: 'Testnet',
    }));
    jest.spyOn(networkActions, 'networkSet');

    middleware(store)(next)(storeCreatedAction);
    expect(networkActions.networkSet).toHaveBeenCalled();
  });

  it(`should clean up on ${actionTypes.accountLoggedOut} `, () => {
    jest.spyOn(settingsActions, 'settingsUpdated');
    const accountLoggedOutAction = {
      type: actionTypes.accountLoggedOut,
    };
    middleware(store)(next)(accountLoggedOutAction);
    expect(settingsActions.settingsUpdated).toHaveBeenCalledWith(
      { token: { active: tokenMap.LSK.key } },
    );
    expect(store.dispatch).toHaveBeenCalledWith({ type: actionTypes.emptyTransactionsData });
  });

  it(`should update logged accounts on ${actionTypes.settingsUpdated} with enabled tokens`, async () => {
    const settingsUpdatedAction = {
      type: actionTypes.settingsUpdated,
      data: { token: { list: { BTC: true } } },
    };
    middleware(store)(next)(settingsUpdatedAction);
    expect(accountActions.updateEnabledTokenAccount).toHaveBeenCalledWith('BTC');
    expect(store.dispatch).toHaveBeenCalled();
  });
});
