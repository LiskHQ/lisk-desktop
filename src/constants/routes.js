import { tokenMap } from './tokens';
import AddBookmark from '../components/screens/bookmarks/addBookmark';
import BlockDetails from '../components/screens/monitor/blockDetails';
import Blocks from '../components/screens/monitor/blocks';
import Bookmarks from '../components/screens/bookmarks';
import Dashboard from '../components/screens/dashboard';
import Voting from '../components/screens/voting';
import DelegatesMonitor from '../components/screens/monitor/delegates';
import HwWalletLogin from '../components/screens/hwWalletLogin';
import Login from '../components/screens/login';
import MonitorAccounts from '../components/screens/monitor/accounts';
import MonitorNetwork from '../components/screens/monitor/network';
import MonitorTransactions from '../components/screens/monitor/transactions';
import Register from '../components/screens/register';
import RegisterDelegate from '../components/screens/registerDelegate';
import SecondPassphrase from '../components/screens/secondPassphrase';
import Send from '../components/screens/send';
import Settings from '../components/screens/settings';
import SignMessage from '../components/screens/signMessage';
import TermsOfUse from '../components/screens/termsOfUse';
import Wallet from '../components/screens/wallet';
import Explorer from '../components/screens/wallet/explorer';
import TransactionDetails from '../components/screens/transactionDetails';
import VerifyMessage from '../components/screens/verifyMessage';
import VotingSummary from '../components/screens/voting/votingSummary';
import SearchBar from '../components/shared/searchBar';
import NewReleaseDialog from '../components/shared/newReleaseDialog/newReleaseDialog';
import { selectSearchParamValue } from '../utils/searchParams';

export default {
  wallet: {
    path: '/wallet',
    component: () => Wallet,
    isPrivate: true,
    exact: false,
    forbiddenTokens: [],
  },
  voting: {
    path: '/delegates',
    component: () => Voting,
    isPrivate: false,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  addAccount: {
    path: '/add-account',
    component: () => Login,
    isPrivate: false,
    forbiddenTokens: [],
  },
  accounts: {
    pathPrefix: '',
    path: '/explorer/accounts',
    searchParam: 'address',
    component: () => Explorer,
    isPrivate: false,
    forbiddenTokens: [],
  },
  hwWallet: {
    path: '/hw-wallet-login',
    component: () => HwWalletLogin,
    isSigninFlow: true,
    isPrivate: false,
    forbiddenTokens: [],
  },
  register: {
    path: '/register',
    component: () => Register,
    isPrivate: false,
    isSigninFlow: true,
    forbiddenTokens: [],
  },
  login: {
    path: '/login',
    component: () => Login,
    isPrivate: false,
    isSigninFlow: true,
    exact: true,
    forbiddenTokens: [],
  },
  termsOfUse: {
    path: '/terms-of-use',
    component: () => TermsOfUse,
    isPrivate: false,
    isSigninFlow: true,
    forbiddenTokens: [],
  },
  monitorTransactions: {
    path: '/monitor/transactions',
    component: () => MonitorTransactions,
    isPrivate: false,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  blocks: {
    pathPrefix: '',
    path: '/monitor/blocks',
    component: search => (
      selectSearchParamValue(search, 'id') ? BlockDetails : Blocks
    ),
    isPrivate: false,
    exact: true,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  monitorAccounts: {
    path: '/monitor/accounts',
    component: () => MonitorAccounts,
    isPrivate: false,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  monitorNetwork: {
    path: '/monitor/network',
    component: () => MonitorNetwork,
    isPrivate: false,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  delegatesMonitor: {
    path: '/monitor/delegates',
    component: () => DelegatesMonitor,
    exact: true,
    isPrivate: false,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  dashboard: {
    path: '/',
    component: () => Dashboard,
    isPrivate: false,
    forbiddenTokens: [],
    exact: true,
  },
};

export const modals = {
  addBookmark: {
    path: '/bookmarks/add-bookmark',
    component: AddBookmark,
    isPrivate: false,
    forbiddenTokens: [],
  },
  bookmarks: {
    path: '/bookmarks',
    component: Bookmarks,
    isPrivate: false,
    forbiddenTokens: [],
  },
  send: {
    path: '/wallet/send',
    component: Send,
    isPrivate: true,
    forbiddenTokens: [],
  },
  votingSummary: {
    path: '/delegates/vote',
    component: VotingSummary,
    isPrivate: true,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  settings: {
    path: '/settings',
    component: Settings,
    isPrivate: false,
    forbiddenTokens: [],
  },
  secondPassphrase: {
    path: '/second-passphrase',
    component: SecondPassphrase,
    isPrivate: true,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  signMessage: {
    path: '/sign-message',
    component: SignMessage,
    isPrivate: true,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  verifyMessage: {
    path: '/verify-message',
    component: VerifyMessage,
    isPrivate: false,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  registerDelegate: {
    path: '/register-delegate',
    component: RegisterDelegate,
    isPrivate: true,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  search: {
    path: '/search',
    component: SearchBar,
    isPrivate: false,
    forbiddenTokens: [],
  },
  transactionDetails: {
    pathPrefix: '',
    path: '/explorer/transactions',
    pathSuffix: '/:id?',
    component: TransactionDetails,
    isPrivate: false,
    forbiddenTokens: [],
  },
  newRelease: {
    component: NewReleaseDialog,
  },
};
