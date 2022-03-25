import {
  accountDataUpdated, transactionsRetrieved, settingsUpdated,
  votesRetrieved, emptyTransactionsData, networkSelected, networkStatusUpdated,
} from '@common/store/actions';

import { actionTypes } from '@common/configuration';
import { MODULE_ASSETS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import routes from '@screens/router/routes';
import { tokenMap } from '@token/configuration/tokens';
import * as transactionApi from '@transaction/utilities/api';
import { getAutoLogInData } from '@common/utilities/login';
import history from '@common/utilities/history';
import middleware from './middleware';

jest.mock('@common/utilities/history');

jest.mock('@transaction/utilities/api', () => ({
  getTransactions: jest.fn(),
  emptyTransactionsData: jest.fn(),
}));

jest.mock('@common/store/actions', () => ({
  accountDataUpdated: jest.fn(),
  transactionsRetrieved: jest.fn(),
  settingsUpdated: jest.fn(),
  votesRetrieved: jest.fn(),
  emptyTransactionsData: jest.fn(),
  networkSelected: jest.fn(),
  networkStatusUpdated: jest.fn(),
}));

jest.mock('@common/utilities/login', () => ({
  getAutoLogInData: jest.fn(),
  shouldAutoLogIn: jest.fn(),
}));

jest.mock('@transaction/utilities/api');

jest.mock('@common/utilities/lsk');

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
      nodeUrl: 'http://localhost:4000',
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

const settings = {
  token: { active: 'LSK' },
  statistics: false,
  network: {
    name: 'customNode',
    address: 'http://example.com',
  },
  statisticsRequest: true,
  statisticsFollowingDay: true,
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
  settings,
};

describe('Account middleware', () => {
  const next = jest.fn();
  let store;

  window.Notification = () => { };
  const windowNotificationSpy = jest.spyOn(window, 'Notification');

  beforeEach(() => {
    transactionApi.getTransactions.mockResolvedValue({
      data: transactions,
    });
    store = {
      dispatch: jest.fn().mockImplementation(() => ({})),
      getState: () => ({ ...defaultState }),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Basic behavior', () => {
    it('should pass the action to next middleware', async () => {
      middleware(store)(next)(newBlockCreated);
      expect(next).toHaveBeenCalledWith(newBlockCreated);
    });
    it('should not pass the action to next middleware', () => {
      const actionNewBlockCreatedAction = {
        type: actionTypes.newBlockCreated,
        data: {
          block: {
            numberOfTransactions: 0,
            id: '513008230952104224',
          },
        },
      };
      middleware(store)(next)(actionNewBlockCreatedAction);
      expect(next).toHaveBeenCalledWith(actionNewBlockCreatedAction);
    });
  });

  describe('on settingsRetrieved', () => {
    it('should set the network from the settings', () => {
      const accountLoggedOutAction = {
        type: actionTypes.settingsRetrieved,
      };
      middleware(store)(next)(accountLoggedOutAction);
      expect(networkSelected).toHaveBeenCalledWith(settings.network);
      expect(networkStatusUpdated).toHaveBeenCalled();
    });

    it('should set the network from defaults if no value stored in the settings', () => {
      const accountLoggedOutAction = {
        type: actionTypes.settingsRetrieved,
      };

      const noNetworkState = {
        ...defaultState,
        settings: {
          ...defaultState.settings,
          network: {},
        },
      };

      const noNetworkStore = {
        dispatch: jest.fn().mockImplementation(() => ({})),
        getState: () => noNetworkState,
      };
      middleware(noNetworkStore)(next)(accountLoggedOutAction);
      expect(networkSelected).toHaveBeenCalledWith({
        address: 'https://service.lisk.com',
        name: 'mainnet',
      });
    });
  });

  describe('on newBlockCreated', () => {
    it('should call account API methods', async () => {
      middleware(store)(next)(newBlockCreated);
      jest.runOnlyPendingTimers();
      await expect(next).toHaveBeenCalled();
    });

    it('should call account BTC API methods when BTC is the active token', async () => {
      // Arrange
      const btcAddress = 'n45uoyzDvep8cwgkfxq3H3te1ujWyu1kkB';
      store = {
        dispatch: jest.fn().mockImplementation(() => ({})),
        getState: () => ({
          ...defaultState,
          settings: { token: { active: 'BTC' } },
          account: { summary: { address: btcAddress } },
          transactions: { confirmed: [{ senderId: btcAddress, confirmations: 1 }] },
        }),
      };

      // Act
      await middleware(store)(next)(newBlockCreated);

      // Assert
      expect(transactionApi.getTransactions).toHaveBeenCalledWith({ network: expect.anything(), params: expect.anything() }, 'BTC');
      expect(accountDataUpdated).toHaveBeenCalled();
      expect(transactionsRetrieved).toHaveBeenCalledWith({
        address: btcAddress,
        filters: undefined,
      });
    });

    it('should call account LSK API methods when LSK is the active token', async () => {
      // Act
      await middleware(store)(next)(newBlockCreated);

      // Assert
      expect(transactionApi.getTransactions).toHaveBeenCalledWith({ network: expect.anything(), params: expect.anything() }, 'LSK');
      expect(accountDataUpdated).toHaveBeenCalled();
      expect(transactionsRetrieved).toHaveBeenCalledWith({
        address: expect.anything(),
        filters: undefined,
      });
    });

    it('should not dispatch when getTransactions returns invalid transaction', async () => {
      // Arrange
      transactionApi.getTransactions.mockResolvedValue({
        data: [undefined],
      });

      // Act
      await middleware(store)(next)(newBlockCreated);

      // Assert
      expect(accountDataUpdated).toHaveBeenCalledTimes(0);
      expect(transactionsRetrieved).toHaveBeenCalledTimes(0);
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
    it('should not dispatch votesRetrieved on transactionsRetrieved if confirmed tx list contains delegateRegistration transactions', () => {
      transactionsRetrievedAction
        .data.confirmed[0].type = MODULE_ASSETS_NAME_ID_MAP.registerDelegate;
      middleware(store)(next)(transactionsRetrievedAction);
      expect(votesRetrieved).not.toHaveBeenCalled();
    });
  });

  describe('on storeCreated', () => {
    it.skip('should do nothing if autologin data is NOT found in localStorage', () => {
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

  describe('on accountSettingsUpdated', () => {
    it('Account Setting Update Sucessfull', () => {
      const state = store.getState();
      store.getState = () => ({
        ...state,
        account: {
          ...state.account,
          info: {
            LSK: { summary: { address: '123456L' } },
            BTC: { summary: { address: '123456L' } },
          },
        },
      });
      const accountSettingsUpdatedAction = {
        type: actionTypes.settingsUpdated,
        data: { token: 'LSK' },
      };
      middleware(store)(next)(accountSettingsUpdatedAction);
      expect(store.dispatch).toHaveBeenCalled();
    });
    it('Account Setting Update Unsucessfull', () => {
      const accountSettingsUpdatedAction = {
        type: actionTypes.settingsUpdated,
        data: { token: '' },
      };
      middleware(store)(next)(accountSettingsUpdatedAction);
      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('on accountSettingsRetrieved', () => {
    it('Account Setting Retrieve Sucessfull', async () => {
      const accountSettingsRetrievedAction = {
        type: actionTypes.settingsRetrieved,
        data: { token: 'LSK' },
      };
      getAutoLogInData.mockImplementation(() => ({
        settings: {
          keys: {
            loginKey: true,
            liskServiceUrl: 'test',
          },
        },
      }));
      await middleware(store)(next)(accountSettingsRetrievedAction);
      expect(next).toHaveBeenCalledWith(accountSettingsRetrievedAction);
    });
    it('Account Setting Retrieve Sucessfull without statistics', async () => {
      const state = store.getState();
      store.getState = () => ({
        ...state,
        settings: {
          ...state.settings,
          statistics: true,
        },
      });

      const accountSettingsRetrievedAction = {
        type: actionTypes.settingsRetrieved,
        data: { token: 'LSK' },
      };
      getAutoLogInData.mockImplementation(() => ({
        settings: {
          keys: {
            loginKey: true,
            liskServiceUrl: 'test',
          },
        },
      }));
      await middleware(store)(next)(accountSettingsRetrievedAction);
      expect(next).toHaveBeenCalledWith(accountSettingsRetrievedAction);
    });
  });

  describe('on accountUpdated', () => {
    it('should not redirect to the reclaim screen if the account is migrated', async () => {
      const action = {
        type: actionTypes.accountLoggedIn,
        data: { info: { LSK: { summary: { isMigrated: true } } } },
      };
      middleware(store)(next)(action);
      expect(history.push).not.toHaveBeenCalledWith(routes.reclaim.path);
    });

    it('should redirect to the reclaim screen if the account is not migrated', async () => {
      const action = {
        type: actionTypes.accountLoggedIn,
        data: { info: { LSK: { summary: { isMigrated: false } } } },
      };
      middleware(store)(next)(action);
      expect(history.push).toHaveBeenCalledWith(routes.reclaim.path);
    });
    it('should not redirect to the reclaim screen if the account is migrated with actionUpdate', async () => {
      const action = {
        type: actionTypes.accountUpdated,
        data: { info: { LSK: { summary: { isMigrated: true } } } },
      };
      middleware(store)(next)(action);
      expect(next).toHaveBeenCalledWith(action);
    });
  });
});
