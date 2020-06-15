import { tokenMap } from './tokens';
import AddBookmark from '../components/screens/bookmarks/addBookmark';
import BlockDetails from '../components/screens/monitor/blockDetails';
import Blocks from '../components/screens/monitor/blocks';
import Bookmarks from '../components/screens/bookmarks';
import Dashboard from '../components/screens/dashboard';
import Delegates from '../components/screens/delegates';
import DelegatesMonitor from '../components/screens/monitor/delegates';
import HwWalletLogin from '../components/screens/hwWalletLogin';
import Login from '../components/screens/login';
import MonitorAccounts from '../components/screens/monitor/accounts';
import MonitorNetwork from '../components/screens/monitor/network';
import MonitorTransactions from '../components/screens/monitor/transactions';
import Register from '../components/screens/register';
import RegisterDelegate from '../components/screens/registerDelegate';
import SecondPassphrase from '../components/screens/secondPassphrase';
import Send from '../components/screens/send/send';
import Settings from '../components/screens/settings';
import SignMessage from '../components/screens/signMessage';
import TermsOfUse from '../components/screens/termsOfUse';
import Wallet from '../components/screens/wallet';
import Explorer from '../components/screens/wallet/explorer';
import TransactionDetails from '../components/screens/transactionDetails';
import VerifyMessage from '../components/screens/verifyMessage';
import VotingSummary from '../components/screens/delegates/votingSummary';

export default {
  dashboard: {
    path: '/dashboard',
    component: Dashboard,
    isPrivate: false,
  },
  addBookmark: {
    path: '/bookmarks/add-bookmark',
    component: AddBookmark,
    isPrivate: false,
  },
  bookmarks: {
    path: '/bookmarks',
    component: Bookmarks,
    isPrivate: false,
  },
  send: {
    path: '/wallet/send',
    component: Send,
    isPrivate: true,
  },
  wallet: {
    path: '/wallet',
    pathSuffix: '/:token?',
    component: Wallet,
    isPrivate: true,
  },
  votingSummary: {
    path: '/delegates/vote',
    component: VotingSummary,
    isPrivate: true,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  delegates: {
    path: '/delegates',
    component: Delegates,
    isPrivate: false,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  settings: {
    path: '/settings',
    component: Settings,
    isPrivate: false,
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
  verifyMMessage: {
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
  addAccount: {
    path: '/add-account',
    component: Login,
    isPrivate: false,
  },
  accounts: {
    pathPrefix: '',
    path: '/explorer/accounts',
    pathSuffix: '/:address?',
    component: Explorer,
    isPrivate: false,
  },
  transactions: {
    pathPrefix: '',
    path: '/explorer/transactions',
    pathSuffix: '/:id?',
    component: TransactionDetails,
    isPrivate: false,
  },
  hwWallet: {
    path: '/hw-wallet-login',
    component: HwWalletLogin,
    isSigninFlow: true,
    isPrivate: false,
  },
  register: {
    path: '/register',
    component: Register,
    isPrivate: false,
    isSigninFlow: true,
  },
  login: {
    path: '/',
    component: Login,
    isPrivate: false,
    isSigninFlow: true,
    exact: true,
  },
  termsOfUse: {
    path: '/terms-of-use',
    component: TermsOfUse,
    isPrivate: false,
    isSigninFlow: true,
  },
  monitorTransactions: {
    path: '/monitor/transactions',
    component: MonitorTransactions,
    isPrivate: false,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  blocks: {
    pathPrefix: '',
    path: '/monitor/blocks',
    component: Blocks,
    isPrivate: false,
    exact: true,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  blockDetails: {
    path: '/monitor/blocks',
    pathSuffix: '/:id?',
    component: BlockDetails,
    isPrivate: false,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  monitorAccounts: {
    path: '/monitor/accounts',
    component: MonitorAccounts,
    isPrivate: false,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  monitorNetwork: {
    path: '/monitor/network',
    component: MonitorNetwork,
    isPrivate: false,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  delegatesMonitor: {
    path: '/monitor/delegates',
    component: DelegatesMonitor,
    exact: true,
    forbiddenTokens: [tokenMap.BTC.key],
  },
};
