import accounts from './accounts';
import moduleAssetSchemas from './schemas';

export default {
  account: {
    info: {
      LSK: {
        ...accounts.genesis,
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
    token: {
      active: 'LSK',
      list: [],
    },
    darkMode: false,
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
    /* signedTransaction: {
      senderPublicKey: 'abc1',
      signatures: ['abc1'],
    }, */
    signedTransaction: {},
    txSignatureError: null,
    txBroadcastError: null,
  },
};
