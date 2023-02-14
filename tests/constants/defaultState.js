import wallets from './wallets';
import savedAccounts from '../fixtures/accounts';
import moduleCommandSchemas from './schemas';

export default {
  wallet: {
    info: {
      LSK: {
        ...wallets.genesis,
      },
    },
  },
  bookmarks: {
    LSK: [],
  },
  service: {
    priceTicker: {
      LSK: {
        USD: 1,
      },
    },
  },
  settings: {
    currency: 'USD',
    darkMode: false,
  },
  token: {
    active: 'LSK',
    list: {
      LSK: true,
    },
  },
  network: {
    name: 'Testnet',
    networks: {
      LSK: {
        serviceUrl: 'http://example.com',
        moduleCommandSchemas,
      },
    },
    statue: {
      online: true,
    },
  },
  staking: {
    validators: [],
    stakes: {},
  },
  appUpdates: {},
  transactions: {
    signedTransaction: {},
    txSignatureError: null,
    txBroadcastError: null,
  },
  account: {
    current: savedAccounts[0],
    list: savedAccounts,
  },
  blockChainApplications: {
    pins: [],
    applications: {},
    current: null,
  },
};
