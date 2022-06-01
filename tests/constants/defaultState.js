import wallets from './wallets';
import moduleAssetSchemas from './schemas';

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
        moduleAssetSchemas,
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
};
