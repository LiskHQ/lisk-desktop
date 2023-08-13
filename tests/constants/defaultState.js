import wallets from './wallets';
import savedAccounts from '../fixtures/accounts';

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
    network: {
      name: 'Testnet',
      serviceUrl: 'http://example.com',
    },
  },
  token: {
    active: 'LSK',
    list: {
      LSK: true,
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
