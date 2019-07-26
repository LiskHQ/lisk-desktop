import { tokenMap } from './tokens';
import Help from '../components/help';
import Setting from '../components/setting';
import SecondPassphrase from '../components/secondPassphrase';
import SignMessage from '../components/signMessage';
import TransactionDashboard from '../components/transactionDashboard';
import AccountTransactions from '../components/accountTransactions';
import Delegates from '../components/delegates';
import Voting from '../components/voting';
import SingleTransaction from '../components/singleTransaction';
import HwWalletLogin from '../components/hwWalletLogin';
import AccountVisualDemo from '../components/accountVisual/demo';
import Send from '../components/send/send';
import Splashscreen from '../components/splashscreen';
import Register from '../components/register';
import Login from '../components/login';
import Extensions from '../components/extensions';
import TermsOfUse from '../components/termsOfUse';
import ToolboxDemo from '../components/toolbox/demo';
import Dashboard from '../components/dashboard';
import Bookmarks from '../components/bookmarks';
import AddBookmark from '../components/bookmarks/addBookmark';
import DelegateRegistration from '../components/delegateRegistration';

export default {
  accountVisualDemo: {
    path: '/account-visual-demo',
    component: AccountVisualDemo,
    isPrivate: true,
    isSigninFlow: true,
  },
  toolboxDemo: {
    path: '/toolbox',
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
    component: AccountTransactions,
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
