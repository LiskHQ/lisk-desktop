import configureStore from 'redux-mock-store';
import delegates from '../constants/delegates';

const forgingTimes = delegates.reduce((acc, item, index) => {
  acc[item.account.publicKey] = {
    time: index * 10,
    tense: 'past',
    status: 'forging',
  };
  return acc;
}, {});

const fakeStore = configureStore();
const defaultStore = {
  account: {},
  network: {
    name: 'Custom Node',
    networks: {
      LSK: {
        nodeUrl: 'http://localhost:4000',
        nethash: '23jh4g',
      },
    },
    status: { online: true },
  },
  settings: {
    autoLog: true,
    advancedMode: true,
    areTermsOfUseAccepted: true,
    token: {
      active: 'LSK',
      list: {
        BTC: true,
        LSK: true,
      },
    },
  },
  search: {
    suggestions: {
      delegates: [],
      addresses: [],
      transactions: [],
    },
  },
  transactions: {
    pending: [],
  },
  blocks: {
    latestBlocks: delegates,
    forgingTimes,
  },
};

export default (props = {}) => fakeStore({ ...defaultStore, ...props });
