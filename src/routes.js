import AddBookmark from '@screens/bookmarks/addBookmark';
import BlockDetails from '@screens/monitor/blockDetails';
import Blocks from '@screens/monitor/blocks';
import Bookmarks from '@screens/bookmarks/list';
import Dashboard from '@screens/dashboard';
import DelegatesMonitor from '@screens/monitor/delegates';
import HwWalletLogin from '@screens/hwWalletLogin';
import Login from '@screens/login';
import MonitorAccounts from '@screens/monitor/accounts';
import MonitorNetwork from '@screens/monitor/network';
import MonitorTransactions from '@screens/monitor/transactions';
import Register from '@screens/register';
import RegisterDelegate from '@screens/registerDelegate';
import Send from '@screens/send';
import Settings from '@screens/settings';
import SignMessage from '@screens/signMessage';
import TermsOfUse from '@screens/termsOfUse';
import Wallet from '@screens/wallet';
import Explorer from '@screens/wallet/explorer';
import TransactionDetails from '@screens/transactionDetails';
import VerifyMessage from '@screens/verifyMessage';
import Request from '@screens/request';
import LockedBalance from '@screens/lockedBalance';
import EditVote from '@screens/editVote';
import VotingQueue from '@screens/votingQueue';
import DeviceDisconnect from '@screens/deviceDisconnectDialog';
import NewReleaseDialog from '@shared/newReleaseDialog/newReleaseDialog';
import SearchBar from '@shared/searchBar';
import ReclaimBalance from '@screens/reclaimBalance';
import ReclaimBalanceModal from '@screens/reclaimBalance/modal';
import MultiSignature from '@screens/multiSignature';
import SignMultiSigTransaction from '@screens/signMultiSignTransaction';
import MultisigAccountDetails from '@screens/multisigAccountDetails';
import { tokenMap } from '@constants';

export default {
  wallet: {
    path: '/wallet',
    component: Wallet,
    isPrivate: true,
    exact: false,
    forbiddenTokens: [],
  },
  addAccount: {
    path: '/add-account',
    component: Login,
    isPrivate: false,
    forbiddenTokens: [],
  },
  account: {
    path: '/account',
    searchParam: 'address',
    component: Explorer,
    isPrivate: false,
    forbiddenTokens: [],
  },
  hwWallet: {
    path: '/hw-wallet-login',
    component: HwWalletLogin,
    isSigninFlow: true,
    isPrivate: false,
    forbiddenTokens: [],
  },
  register: {
    path: '/register',
    component: Register,
    isPrivate: false,
    isSigninFlow: true,
    forbiddenTokens: [],
  },
  login: {
    path: '/login',
    component: Login,
    isPrivate: false,
    isSigninFlow: true,
    exact: true,
    forbiddenTokens: [],
  },
  termsOfUse: {
    path: '/terms-of-use',
    component: TermsOfUse,
    isPrivate: false,
    isSigninFlow: true,
    forbiddenTokens: [],
  },
  transactions: {
    path: '/transactions',
    component: MonitorTransactions,
    isPrivate: false,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  blocks: {
    path: '/blocks',
    component: Blocks,
    isPrivate: false,
    exact: true,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  block: {
    path: '/block',
    component: BlockDetails,
    searchParam: 'id',
    isPrivate: false,
    exact: true,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  accounts: {
    path: '/accounts',
    component: MonitorAccounts,
    isPrivate: false,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  network: {
    path: '/network',
    component: MonitorNetwork,
    isPrivate: false,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  delegates: {
    path: '/delegates',
    component: DelegatesMonitor,
    exact: true,
    isPrivate: false,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  reclaim: {
    path: '/reclaim',
    component: ReclaimBalance,
    isPrivate: true,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  dashboard: {
    path: '/',
    component: Dashboard,
    isPrivate: false,
    forbiddenTokens: [],
    exact: true,
  },
};

export const modals = {
  addBookmark: {
    component: AddBookmark,
    isPrivate: false,
    forbiddenTokens: [],
  },
  bookmarks: {
    component: Bookmarks,
    isPrivate: false,
    forbiddenTokens: [],
  },
  send: {
    component: Send,
    isPrivate: true,
    forbiddenTokens: [],
  },
  settings: {
    component: Settings,
    isPrivate: false,
    forbiddenTokens: [],
  },
  signMessage: {
    component: SignMessage,
    isPrivate: true,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  verifyMessage: {
    component: VerifyMessage,
    isPrivate: false,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  registerDelegate: {
    component: RegisterDelegate,
    isPrivate: true,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  search: {
    component: SearchBar,
    isPrivate: false,
    forbiddenTokens: [],
  },
  transactionDetails: {
    component: TransactionDetails,
    isPrivate: false,
    forbiddenTokens: [],
  },
  newRelease: {
    component: NewReleaseDialog,
    isPrivate: false,
    forbiddenTokens: [],
  },
  request: {
    component: Request,
    isPrivate: true,
    forbiddenTokens: [],
  },
  lockedBalance: {
    component: LockedBalance,
    isPrivate: true,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  editVote: {
    component: EditVote,
    isPrivate: true,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  votingQueue: {
    component: VotingQueue,
    isPrivate: true,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  deviceDisconnectDialog: {
    component: DeviceDisconnect,
    isPrivate: false,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  reclaimBalance: {
    component: ReclaimBalanceModal,
    isPrivate: true,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  multiSignature: {
    component: MultiSignature,
    isPrivate: true,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  multisigAccountDetails: {
    component: MultisigAccountDetails,
    isPrivate: true,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  signMultiSignTransaction: {
    component: SignMultiSigTransaction,
    isPrivate: true,
    forbiddenTokens: [tokenMap.BTC.key],
  },
};
