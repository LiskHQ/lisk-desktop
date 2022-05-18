import configureStore from 'redux-mock-store';
import { tokenMap } from '@token/fungible/consts/tokens';
import wallets from '../constants/wallets';
import delegates from '../constants/delegates';

const forgers = Object.values(wallets).slice(0, 9).map((wallet, index) => ({
  username: `genesis_${index}`,
  totalVotesReceived: '100000000000',
  address: wallet.summary.address,
  minActiveHeight: 1,
  isConsensusParticipant: true,
  nextForgingTime: 1620049927 + 10 * index,
}));

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
    autoLog: true,
    advancedMode: true,
    areTermsOfUseAccepted: true,
  },
  token: {
    active: tokenMap.LSK.key,
    list: {
      [tokenMap.BTC.key]: false,
      [tokenMap.LSK.key]: true,
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
    forgers,
    indexBook: forgers.reduce((acc, item, index) => { acc[item.address] = index; return acc; }, {}),
    total: 10000,
  },
};

export default (props = {}) => fakeStore({ ...defaultStore, ...props });
