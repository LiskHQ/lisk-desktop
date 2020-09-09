export default {
  account: {
    info: {
      LSK: {},
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
        networkIdentifier: 'sample_identifier',
        apiVersion: '2',
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
