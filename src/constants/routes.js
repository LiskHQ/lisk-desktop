import { tokenMap } from './tokens';
import AccountVisualDemo from '../components/accountVisual/demo';
import AddBookmark from '../components/bookmarks/addBookmark';
import Bookmarks from '../components/bookmarks';
import Dashboard from '../components/dashboard';
import DelegateRegistration from '../components/delegateRegistration';
import Delegates from '../components/delegates';
import ExplorerTransactions from
  '../components/transactions/explorerTransactions';
import Extensions from '../components/extensions';
import Help from '../components/help';
import HwWalletLogin from '../components/hwWalletLogin';
import Login from '../components/login';
import Register from '../components/register';
import SecondPassphrase from '../components/secondPassphrase';
import Send from '../components/send/send';
import Setting from '../components/setting';
import SignMessage from '../components/signMessage';
import VerifyMessage from '../components/screens/verify-message';
import SingleTransaction from '../components/singleTransaction';
import Splashscreen from '../components/splashscreen';
import TermsOfUse from '../components/termsOfUse';
import ToolboxDemo from '../components/toolbox/demo';
import TransactionDashboard from '../components/transactionDashboard';
import Voting from '../components/voting';

export default {
  accountVisualDemo: {
    path: '/account-visual-demo',
    component: AccountVisualDemo,
    isPrivate: true,
    isSigninFlow: true,
  },
  toolboxDemo: {
    path: '/toolbox',
    pathSuffix: '/:component?',
    component: ToolboxDemo,
    isPrivate: false,
  },
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
    component: TransactionDashboard,
    isPrivate: true,
  },
  voting: {
    path: '/delegates/vote',
    component: Voting,
    isPrivate: true,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  delegates: {
    path: '/delegates',
    component: Delegates,
    isPrivate: false,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  help: {
    path: '/help',
    component: Help,
    isPrivate: false,
  },
  setting: {
    path: '/settings',
    component: Setting,
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
  delegateRegistration: {
    path: '/register-delegate',
    component: DelegateRegistration,
    isPrivate: true,
    forbiddenTokens: [tokenMap.BTC.key],
  },
  addAccount: {
    path: '/add-account',
    component: Login,
    isPrivate: false,
  },
  extensions: {
    path: '/extensions',
    component: Extensions,
    isPrivate: false,
  },
  accounts: {
    pathPrefix: '',
    path: '/explorer/accounts',
    pathSuffix: '/:address?',
    component: ExplorerTransactions,
    isPrivate: false,
  },
  transactions: {
    pathPrefix: '',
    path: '/explorer/transactions',
    pathSuffix: '/:id?',
    component: SingleTransaction,
    isPrivate: false,
  },
  hwWallet: {
    path: '/hw-wallet-login',
    component: HwWalletLogin,
    isSigninFlow: true,
    isPrivate: false,
  },
  splashscreen: {
    path: '/',
    component: Splashscreen,
    isPrivate: false,
    isSigninFlow: true,
    exact: true,
  },
  register: {
    path: '/register',
    component: Register,
    isPrivate: false,
    isSigninFlow: true,
  },
  login: {
    path: '/login',
    component: Login,
    isPrivate: false,
    isSigninFlow: true,
  },
  termsOfUse: {
    path: '/terms-of-use',
    component: TermsOfUse,
    isPrivate: false,
    isSigninFlow: true,
  },
};
