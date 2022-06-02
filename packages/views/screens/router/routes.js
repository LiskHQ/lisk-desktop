import { tokenMap } from '@token/fungible/consts/tokens';

export default {
  wallet: {
    path: '/wallet',
    isPrivate: true,
    exact: false,
    forbiddenTokens: [],
  },
  addAccount: {
    path: '/add-account',
    isPrivate: false,
    forbiddenTokens: [],
  },
  explorer: {
    path: '/explorer',
    searchParam: 'address',
    isPrivate: false,
    forbiddenTokens: [],
  },
  hwWallet: {
    path: '/hw-wallet-login',
    isSigninFlow: true,
    isPrivate: false,
    forbiddenTokens: [],
  },
  register: {
    path: '/register',
    isPrivate: false,
    isSigninFlow: true,
    forbiddenTokens: [],
  },
  login: {
    path: '/login',
    isPrivate: false,
    isSigninFlow: true,
    exact: true,
    forbiddenTokens: [],
  },
  termsOfUse: {
    path: '/terms-of-use',
    isPrivate: false,
    isSigninFlow: true,
    forbiddenTokens: [],
  },
  transactions: {
    path: '/transactions',
    isPrivate: false,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  blocks: {
    path: '/blocks',
    isPrivate: false,
    exact: true,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  block: {
    path: '/block',
    searchParam: 'id',
    isPrivate: false,
    exact: true,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  wallets: {
    path: '/wallets',
    isPrivate: false,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  network: {
    path: '/network',
    isPrivate: false,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  delegates: {
    path: '/delegates',
    exact: true,
    isPrivate: false,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  reclaim: {
    path: '/reclaim',
    isPrivate: true,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  accountSelect: {
    path: '/account/manage',
    isPrivate: false,
    forbiddenTokens: [],
  },
  accountAdd: {
    path: '/account/add/secrete-recovery',
    isPrivate: false,
    forbiddenTokens: [],
    exact: true,
  },
  addAccountChoice: {
    path: '/account/add/initiate',
    isPrivate: false,
    forbiddenTokens: [],
    exact: true,
  },
  accountAddByPassphrase: {
    path: '/account/add/by-passphrase',
    isPrivate: false,
    forbiddenTokens: [],
    exact: true,
  },
  dashboard: {
    path: '/',
    isPrivate: false,
    forbiddenTokens: [],
    exact: true,
  },
};

export const modals = {
  addBookmark: {
    isPrivate: false,
    forbiddenTokens: [],
  },
  bookmarks: {
    isPrivate: false,
    forbiddenTokens: [],
  },
  send: {
    isPrivate: true,
    forbiddenTokens: [],
  },
  settings: {
    isPrivate: false,
    forbiddenTokens: [],
  },
  signMessage: {
    isPrivate: true,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  verifyMessage: {
    isPrivate: false,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  registerDelegate: {
    isPrivate: true,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  search: {
    isPrivate: false,
    forbiddenTokens: [],
  },
  transactionDetails: {
    isPrivate: false,
    forbiddenTokens: [],
  },
  newRelease: {
    isPrivate: false,
    forbiddenTokens: [],
  },
  request: {
    isPrivate: true,
    forbiddenTokens: [],
  },
  lockedBalance: {
    isPrivate: true,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  editVote: {
    isPrivate: true,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  votingQueue: {
    isPrivate: true,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  deviceDisconnectDialog: {
    isPrivate: false,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  reclaimBalance: {
    isPrivate: true,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  multiSignature: {
    isPrivate: true,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  multisigAccountDetails: {
    isPrivate: false,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  signMultiSignTransaction: {
    isPrivate: true,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  delegatePerformance: {
    isPrivate: false,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  setPassword: {
    isPrivate: false,
    forbiddenTokens: [],
  },
};
