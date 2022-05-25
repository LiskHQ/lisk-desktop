import {
  accountDataUpdated, transactionsRetrieved, emptyTransactionsData,
} from '@common/store/actions';

import commonActionTypes from '@common/store/actions/actionTypes';
import blockActionTypes from '@block/store/actionTypes';
import settingsActionTypes from 'src/modules/settings/store/actionTypes';
import * as transactionApi from '@transaction/api';
import { getAutoLogInData } from 'src/utils/login';
import walletActionTypes from './actionTypes';
import middleware from './middleware';

jest.mock('src/utils/history');

jest.mock('@transaction/api', () => ({
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

jest.mock('src/utils/login', () => ({
  getAutoLogInData: jest.fn(),
  shouldAutoLogIn: jest.fn(),
}));

jest.mock('@transaction/api');

jest.mock('@token/fungible/utils/lsk');

const liskAPIClientMock = 'DUMMY_LISK_API_CLIENT';
const storeCreatedAction = {
  type: commonActionTypes.storeCreated,
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

const newBlockCreated = {
  type: blockActionTypes.newBlockCreated,
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

const wallet = {
  info: {
    LSK: {
      summary: {
        address: 'lskgonvfdxt3m6mm7jaeojrj5fnxx7vwmkxq72v79',
      },
    },
  },
};

const settings = {
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
  wallet,
  transactions: {
    pending: [{
      id: 12498250891724098,
    }],
    confirmed: [],
    wallet: {
      summary: {
        address: 'lskgonvfdxt3m6mm7jaeojrj5fnxx7vwmkxq72v79',
        balance: 0,
      },
    },
  },
  delegate: {},
  settings,
  token: { active: 'LSK' },
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
        type: blockActionTypes.newBlockCreated,
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

  describe('on newBlockCreated', () => {
    it('should call account API methods', async () => {
      middleware(store)(next)(newBlockCreated);
      jest.runOnlyPendingTimers();
      await expect(next).toHaveBeenCalled();
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

  describe('on storeCreated', () => {
    it.skip('should do nothing if autologin data is NOT found in localStorage', () => {
      middleware(store)(next)(storeCreatedAction);
      expect(store.dispatch).not.toHaveBeenCalledTimes(liskAPIClientMock);
    });
  });

  describe('on accountLoggedOut', () => {
    it('should clean up', () => {
      const accountLoggedOutAction = {
        type: walletActionTypes.accountLoggedOut,
      };
      middleware(store)(next)(accountLoggedOutAction);
      expect(emptyTransactionsData).toHaveBeenCalled();
    });
  });

  describe('on accountSettingsUpdated', () => {
    it('Account Setting Update Sucessful', () => {
      const state = store.getState();
      store.getState = () => ({
        ...state,
        wallet: {
          ...state.wallet,
          info: {
            LSK: { summary: { address: '123456L' } },
          },
        },
      });
      const accountSettingsUpdatedAction = {
        type: settingsActionTypes.settingsUpdated,
        data: { token: 'LSK' },
      };
      middleware(store)(next)(accountSettingsUpdatedAction);
      expect(store.dispatch).toHaveBeenCalled();
      expect(accountDataUpdated).toHaveBeenCalledWith('enabled');
    });
    it('Account Setting Update Unsucessful', () => {
      const accountSettingsUpdatedAction = {
        type: settingsActionTypes.settingsUpdated,
        data: { token: '' },
      };
      middleware(store)(next)(accountSettingsUpdatedAction);
      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('on accountSettingsRetrieved', () => {
    it('Account Setting Retrieve Sucessful', async () => {
      const accountSettingsRetrievedAction = {
        type: settingsActionTypes.settingsRetrieved,
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
    it('Account Setting Retrieve Sucessful without statistics', async () => {
      const state = store.getState();
      store.getState = () => ({
        ...state,
        settings: {
          ...state.settings,
          statistics: true,
        },
      });

      const accountSettingsRetrievedAction = {
        type: settingsActionTypes.settingsRetrieved,
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
});
