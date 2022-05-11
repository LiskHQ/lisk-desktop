import wallets from './wallets';
import moduleAssetSchemas from './schemas';

export default {
  wallet: {
    info: {
      LSK: {
        ...wallets.genesis,
      },
      BTC: {},
    },
  },
  bookmarks: {
    LSK: [],
    BTC: [],
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
    list: [],
  },
  network: {
    name: 'Testnet',
    networks: {
      LSK: {
        serviceUrl: 'http://example.com',
        moduleAssetSchemas,
      },
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
