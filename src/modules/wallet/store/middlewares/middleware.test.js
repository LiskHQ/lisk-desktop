import {
  accountDataUpdated,
} from 'src/redux/actions';

import commonActionTypes from 'src/modules/common/store/actionTypes';
import settingsActionTypes from 'src/modules/settings/store/actionTypes';
import * as transactionApi from '@transaction/api';
import { getAutoLogInData } from 'src/utils/login';
import middleware from './middleware';

jest.mock('src/utils/history');

jest.mock('@transaction/api', () => ({
  getTransactions: jest.fn(),
}));

jest.mock('src/redux/actions', () => ({
  accountDataUpdated: jest.fn(),
  transactionsRetrieved: jest.fn(),
  settingsUpdated: jest.fn(),
  stakesRetrieved: jest.fn(),
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
    params: {
      recipient: {
        address: 'lskgonvfdxt3m6mm7jaeojrj5fnxx7vwmkxq72v79',
      },
      data: 'Message',
      amount: 10e8,
    },
    moduleCommand: 'token:transfer',
    moduleAssetName: 'token:transfer',
    fee: '295000',
    height: 741142,
    nonce: '2',
  },
  {
    sender: {
      address: 'lsks6uckwnap7s72ov3edddwgxab5e89t6uy8gjt6',
    },
    params: {
      recipient: {
        address: 'lskgonvfdxt3m6mm7jaeojrj5fnxx7vwmkxq72v79',
      },
      data: '',
      amount: 10e8,
    },
    moduleCommand: 'token:transfer',
    moduleAssetName: 'token:transfer',
    fee: '295000',
    height: 741141,
    nonce: '1',
  },
];

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
  validator: {},
  settings,
  token: { active: 'LSK', list: { LSK: true } },
};

describe('Account middleware', () => {
  const next = jest.fn();
  let store;

  window.Notification = () => { };
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

  describe('on storeCreated', () => {
    it.skip('should do nothing if autologin data is NOT found in localStorage', () => {
      middleware(store)(next)(storeCreatedAction);
      expect(store.dispatch).not.toHaveBeenCalledTimes(liskAPIClientMock);
    });
  });

  describe('on accountSettingsUpdated', () => {
    it('Account Setting Update Successful', () => {
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
    it('Account Setting Update not successful', () => {
      const accountSettingsUpdatedAction = {
        type: settingsActionTypes.settingsUpdated,
        data: { token: '' },
      };
      middleware(store)(next)(accountSettingsUpdatedAction);
      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('on accountSettingsRetrieved', () => {
    it('Account Setting Retrieve Successful', async () => {
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
    it('Account Setting Retrieve Successful without statistics', async () => {
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
