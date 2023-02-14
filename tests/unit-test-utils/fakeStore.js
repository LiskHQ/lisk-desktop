import configureStore from 'redux-mock-store';
import { tokenMap } from '@token/fungible/consts/tokens';

const fakeStore = configureStore();
const defaultStore = {
  wallet: {},
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
    advancedMode: true,
    areTermsOfUseAccepted: true,
  },
  token: {
    active: tokenMap.LSK.key,
    list: {
      [tokenMap.LSK.key]: true,
    },
  },
  search: {
    suggestions: {
      validators: [],
      addresses: [],
      transactions: [],
    },
  },
  transactions: {
    pending: [],
  },
  blockChainApplications: {
    pins: [],
    applications: {},
    current: null,
  },
};

export default (props = {}) => fakeStore({ ...defaultStore, ...props });
