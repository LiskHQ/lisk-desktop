import wallets from './wallets';
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
  voting: {
    delegates: [],
    votes: {},
  },
  blocks: {
    latestBlocks: [],
    awaitingForgers: [],
    forgingTimes: {},
  },
  appUpdates: {},
  transactions: {
    signedTransaction: {},
    txSignatureError: null,
    txBroadcastError: null,
  },
  account: {
    current: {},
    list: {},
  },
  blockChainApplications: {
    pins: [],
    applications: {},
    current: null,
  },
};
