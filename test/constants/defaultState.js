import accounts from './accounts';

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
};
