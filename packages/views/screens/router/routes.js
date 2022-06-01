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
    forbiddenTokens: [],
  },
  blocks: {
    path: '/blocks',
    isPrivate: false,
    exact: true,
    forbiddenTokens: [],
  },
  block: {
    path: '/block',
    searchParam: 'id',
    isPrivate: false,
    exact: true,
    forbiddenTokens: [],
  },
  wallets: {
    path: '/wallets',
    isPrivate: false,
    forbiddenTokens: [],
  },
  network: {
    path: '/network',
    isPrivate: false,
    forbiddenTokens: [],
  },
  delegates: {
    path: '/delegates',
    exact: true,
    isPrivate: false,
    forbiddenTokens: [],
  },
  reclaim: {
    path: '/reclaim',
    isPrivate: true,
    forbiddenTokens: [],
  },
  accountSelect: {
    path: '/account/manage',
    isPrivate: false,
    forbiddenTokens: [],
  },
  accountAdd: {
    path: '/account/add',
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
    forbiddenTokens: [],
  },
  verifyMessage: {
    isPrivate: false,
    forbiddenTokens: [],
  },
  registerDelegate: {
    isPrivate: true,
    forbiddenTokens: [],
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
    forbiddenTokens: [],
  },
  editVote: {
    isPrivate: true,
    forbiddenTokens: [],
  },
  votingQueue: {
    isPrivate: true,
    forbiddenTokens: [],
  },
  deviceDisconnectDialog: {
    isPrivate: false,
    forbiddenTokens: [],
  },
  reclaimBalance: {
    isPrivate: true,
    forbiddenTokens: [],
  },
  multiSignature: {
    isPrivate: true,
    forbiddenTokens: [],
  },
  multisigAccountDetails: {
    isPrivate: false,
    forbiddenTokens: [],
  },
  signMultiSignTransaction: {
    isPrivate: true,
    forbiddenTokens: [],
  },
  delegatePerformance: {
    isPrivate: false,
    forbiddenTokens: [],
  },
  setPasswordSuccess: {
    isPrivate: false,
    forbiddenTokens: [],
  },
};
