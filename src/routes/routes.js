export default {
  addAccountBySecretRecovery: {
    path: '/account/add/secret-recovery',
    isPrivate: false,
    forbiddenTokens: [],
    exact: true,
  },
  addAccountOptions: {
    path: '/account/add',
    isPrivate: false,
    forbiddenTokens: [],
    exact: true,
  },
  block: {
    path: '/block',
    searchParam: 'id',
    isPrivate: false,
    exact: true,
    forbiddenTokens: [],
  },
  blocks: {
    path: '/blocks',
    isPrivate: false,
    exact: true,
    forbiddenTokens: [],
  },
  dashboard: {
    path: '/dashboard',
    isPrivate: false,
    forbiddenTokens: [],
    exact: true,
  },
  validators: {
    path: '/validators',
    exact: true,
    isPrivate: false,
    forbiddenTokens: [],
  },
  validatorProfile: {
    path: '/validators/profile',
    exact: true,
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
  // login: {
  //   path: '/login',
  //   isPrivate: false,
  //   isSigninFlow: true,
  //   exact: true,
  //   forbiddenTokens: [],
  // },
  backupRecoveryPhraseFlow: {
    path: '/account/backup-recovery-phrase',
    isPrivate: true,
    forbiddenTokens: [],
  },
  manageAccounts: {
    path: '/',
    isPrivate: false,
    forbiddenTokens: [],
    exact: true,
  },
  network: {
    path: '/network',
    isPrivate: false,
    forbiddenTokens: [],
  },
  reclaim: {
    path: '/reclaim',
    isPrivate: true,
    forbiddenTokens: [],
  },
  register: {
    path: '/register',
    isPrivate: false,
    isSigninFlow: true,
    forbiddenTokens: [],
  },
  addAccountByFile: {
    path: '/account/add/by-file',
    isPrivate: false,
    forbiddenTokens: [],
    exact: true,
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
    exact: true,
    forbiddenTokens: [],
  },
  wallets: {
    path: '/wallets',
    isPrivate: false,
    forbiddenTokens: [],
  },
  wallet: {
    path: '/wallet',
    isPrivate: true,
    exact: true,
    forbiddenTokens: [],
  },
  blockchainApplications: {
    path: '/applications',
    isPrivate: false,
    forbiddenTokens: [],
  },
  transactionDetails: {
    path: '/transactions/details',
    exact: true,
    isPrivate: false,
    forbiddenTokens: [],
  },
  allTokens: {
    path: '/wallet/tokens/all',
    exact: true,
    isPrivate: false,
    forbiddenTokens: [],
  },
  sentStakes: {
    path: '/validators/profile/stakes',
    exact: true,
    isPrivate: false,
    forbiddenTokens: [],
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
  editAccount: {
    isPrivate: true,
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
  registerValidator: {
    isPrivate: true,
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
  claimRewardsView: {
    isPrivate: true,
    forbiddenTokens: [],
  },
  editStake: {
    isPrivate: true,
    forbiddenTokens: [],
  },
  selectHardwareDeviceModal: {
    isPrivate: true,
    forbiddenTokens: [],
  },
  stakingQueue: {
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
  validatorPerformance: {
    isPrivate: false,
    forbiddenTokens: [],
  },
  setPassword: {
    isPrivate: false,
    forbiddenTokens: [],
  },
  switchAccount: {
    isPrivate: true,
    forbiddenTokens: [],
  },
  selectNode: {
    isPrivate: false,
    forbiddenTokens: [],
  },
  removeSelectedAccount: {
    isPrivate: false,
    forbiddenTokens: [],
  },
  blockChainApplicationDetails: {
    isPrivate: false,
    forbiddenTokens: [],
  },
  addApplicationList: {
    isPrivate: false,
    forbiddenTokens: [],
  },
  addApplicationSuccess: {
    isPrivate: false,
    forbiddenTokens: [],
  },
  manageApplications: {
    isPrivate: false,
    forbiddenTokens: [],
  },
  removeApplicationFlow: {
    isPrivate: false,
    forbiddenTokens: [],
  },
  connectionProposal: {
    isPrivate: false,
    forbiddenTokens: [],
  },
  sessionManager: {
    isPrivate: false,
    forbiddenTokens: [],
  },
  connectionSummary: {
    isPrivate: false,
    forbiddenTokens: [],
  },
  RequestView: {
    isPrivate: false,
    forbiddenTokens: [],
  },
  connectionStatus: {
    isPrivate: false,
    forbiddenTokens: [],
  },
};
