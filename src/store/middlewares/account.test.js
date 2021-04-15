import {
  accountDataUpdated, transactionsRetrieved, settingsUpdated, votesRetrieved, emptyTransactionsData,
} from '@actions';

import {
  tokenMap, actionTypes, MODULE_ASSETS_NAME_ID_MAP, routes,
} from '@constants';
import middleware from './account';
import * as transactionApi from '@api/transaction';
import {
  addSearchParamsToUrl,
  removeSearchParamsFromUrl,
} from '../../utils/searchParams';
import history from '../../history';

jest.mock('../../utils/searchParams', () => ({
  selectSearchParamValue: jest.fn(() => ({ initialization: true })),
  removeSearchParamsFromUrl: jest.fn(),
  addSearchParamsToUrl: jest.fn(),
}));

jest.mock('../../history');

jest.mock('@api/transaction', () => ({
  getTransactions: jest.fn(),
}));

jest.mock('@actions', () => ({
  accountDataUpdated: jest.fn(),
  transactionsRetrieved: jest.fn(),
  settingsUpdated: jest.fn(),
  votesRetrieved: jest.fn(),
  emptyTransactionsData: jest.fn(),
}));


const liskAPIClientMock = 'DUMMY_LISK_API_CLIENT';
const storeCreatedAction = {
  type: actionTypes.storeCreated,
};

const transactions = [
  {
    sender: {
      address: 'lsks6uckwnap7s72ov3edddwgxab5e89t6uy8gjt6',
    },
    asset: {
      recipient: {
        address: 'lskgonvfdxt3m6mm7jaeojrj5fnxx7vwmkxq72v79',
      },
      data: 'Message',
      amount: 10e8,
    },
    moduleAssetId: '2:0',
    moduleAssetName: 'token:transfer',
    fee: '295000',
    height: 741142,
    nonce: '2',
  },
  {
    sender: {
      address: 'lsks6uckwnap7s72ov3edddwgxab5e89t6uy8gjt6',
    },
    asset: {
      recipient: {
        address: 'lskgonvfdxt3m6mm7jaeojrj5fnxx7vwmkxq72v79',
      },
      data: '',
      amount: 10e8,
    },
    moduleAssetId: '2:0',
    moduleAssetName: 'token:transfer',
    fee: '295000',
    height: 741141,
    nonce: '1',
  },
];

const block = {
  numberOfTransactions: 2,
  id: '513008230952104224',
};

const transactionsRetrievedAction = {
  type: actionTypes.transactionsRetrieved,
  data: {
    confirmed: [{
      type: MODULE_ASSETS_NAME_ID_MAP.registerDelegate,
      confirmations: 1,
    }],
  },
};

const newBlockCreated = {
  type: actionTypes.newBlockCreated,
  data: { block },
};

const network = {
  status: { online: true },
  name: 'Custom Node',
  networks: {
    LSK: {
      nodeUrl: 'hhtp://localhost:4000',
      nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
    },
  },
};

const account = {
  info: {
    LSK: {
      summary: {
        address: 'lskgonvfdxt3m6mm7jaeojrj5fnxx7vwmkxq72v79',
      },
    },
  },
};

const defaultState = {
  network,
  account,
  transactions: {
    pending: [{
      id: 12498250891724098,
    }],
    confirmed: [],
    account: {
      summary: {
        address: 'lskgonvfdxt3m6mm7jaeojrj5fnxx7vwmkxq72v79',
        balance: 0,
      },
    },
  },
  delegate: {},
  settings: { token: { active: 'LSK' }, statistics: false },
};

describe('Account middleware', () => {
  const next = jest.fn();
  const store = {
    dispatch: jest.fn().mockImplementation(() => ({})),
    getState: () => defaultState,
  };

  jest.useFakeTimers();
  window.Notification = () => { };
  const windowNotificationSpy = jest.spyOn(window, 'Notification');

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Basic behavior', () => {
    it('should pass the action to next middleware', () => {
      middleware(store)(next)(newBlockCreated);
      expect(next).toHaveBeenCalledWith(newBlockCreated);
    });
  });

  describe('on newBlockCreated', () => {
    it('should call account API methods', () => {
      transactionApi.getTransactions.mockResolvedValue({ data: transactions });
      const promise = middleware(store)(next);
      promise(newBlockCreated).then(() => {
        jest.runOnlyPendingTimers();
        expect(store.dispatch).toHaveBeenCalled();
      });
    });

    it('should call account BTC API methods when BTC is the active token', () => {
      const state = store.getState();
      state.settings = { token: { active: 'BTC' } };
      const address = 'n45uoyzDvep8cwgkfxq3H3te1ujWyu1kkB';
      state.account = { address };
      state.transactions.confirmed = [{ senderId: address, confirmations: 1 }];
      const promise = middleware(store)(next);
      promise(newBlockCreated).then(() => {
        jest.runOnlyPendingTimers();
        expect(transactionsRetrieved)
          .toHaveBeenCalledWith({
            address, filters: undefined, pendingTransactions: state.transactions.pending,
          });
      });
    });

    it('should not fetch transactions if confirmed tx list does not contain recent transaction', () => {
      const state = store.getState();
      store.getState = () => ({
        ...state,
        transactions: {
          ...state.transactions,
          confirmed: [{ confirmations: 10 }],
          address: 'lskgonvfdxt3m6mm7jaeojrj5fnxx7vwmkxq72v79',
        },
      });
      const currentState = store.getState();

      const promise = middleware(store)(next);
      promise(newBlockCreated).then(() => {
        jest.runOnlyPendingTimers();
        expect(accountDataUpdated).toHaveBeenCalledWith({
          account: currentState.account,
          transactions: currentState.transactions,
        });
      });
    });

    it('should fetch transactions if confirmed tx list contains recent transaction', () => {
      const state = store.getState();
      store.getState = () => ({
        ...state,
        transactions: {
          pending: [{
            id: 12498250891724098,
          }],
          confirmed: [{ confirmations: 10, address: 'lskgonvfdxt3m6mm7jaeojrj5fnxx7vwmkxq72v79' }],
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

      const promise = middleware(store)(next);
      promise(newBlockCreated).then(() => {
        jest.runOnlyPendingTimers();
        expect(accountDataUpdated).toHaveBeenCalledWith({
          account: currentState.account,
          transactions: currentState.transactions,
        });
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
  });

  describe('on transactionsRetrieved', () => {
    it('should dispatch votesRetrieved on transactionsRetrieved if confirmed tx list contains delegateRegistration transactions', () => {
      transactionsRetrievedAction.data.confirmed[0].type = MODULE_ASSETS_NAME_ID_MAP.voteDelegate;
      middleware(store)(next)(transactionsRetrievedAction);
      expect(votesRetrieved).toHaveBeenCalled();
    });
  });

  describe('on storeCreated', () => {
    it.skip('should do nothing if autologin data NOT found in localStorage', () => {
      middleware(store)(next)(storeCreatedAction);
      expect(store.dispatch).not.toHaveBeenCalledTimes(liskAPIClientMock);
    });
  });

  describe('on accountLoggedOut', () => {
    it('should clean up', () => {
      const accountLoggedOutAction = {
        type: actionTypes.accountLoggedOut,
      };
      middleware(store)(next)(accountLoggedOutAction);
      expect(settingsUpdated).toHaveBeenCalledWith(
        { token: { active: tokenMap.LSK.key } },
      );
      expect(emptyTransactionsData).toHaveBeenCalled();
    });
  });

  describe('on settingsUpdated', () => {
    it('should update logged accounts with enabled tokens', async () => {
      const settingsUpdatedAction = {
        type: actionTypes.settingsUpdated,
        data: { token: { list: { BTC: true } } },
      };
      middleware(store)(next)(settingsUpdatedAction);
      expect(accountDataUpdated).toHaveBeenCalledWith('enabled');
      expect(store.dispatch).toHaveBeenCalled();
    });
  });

  describe('on accountUpdated', () => {
    it('should do nothing if uninitialsed account logs in with insufficient balance', () => {
      const action = {
        type: actionTypes.accountLoggedIn,
        data: { info: { LSK: { serverPublicKey: '', balance: '0' } } },
      };
      middleware(store)(next)(action);
      expect(history.push).not.toHaveBeenCalledWith('/wallet?modal=send&initialization=true');
      expect(history.push).not.toHaveBeenCalledWith('initialization');
    });

    it.skip('should redirect to the initialization screen if uninitialsed account logs in with enough balance', () => {
      const action = {
        type: actionTypes.accountLoggedIn,
        data: { info: { LSK: { serverPublicKey: '', balance: '2e8' } } },
      };
      middleware(store)(next)(action);
      expect(history.push).toHaveBeenCalledWith(routes.initialization.path);
    });

    it.skip('should call the modal remove function if actionTypes.accountUpdated is called with enough balance', () => {
      const action = {
        type: actionTypes.accountUpdated,
        data: { serverPublicKey: 'some_key', balance: '2e8' },
      };
      middleware(store)(next)(action);
      expect(addSearchParamsToUrl).not.toHaveBeenCalled();
      expect(removeSearchParamsFromUrl).toHaveBeenCalled();
      expect(history.push).toHaveBeenCalledWith(routes.wallet.path);
    });
  });
});
