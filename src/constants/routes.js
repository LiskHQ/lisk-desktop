import Help from '../components/help';
import Sidechains from '../components/sidechains';
import Setting from '../components/setting';
import SecondPassphrase from '../components/secondPassphrase';
import SignMessage from '../components/signMessage';
import SearchResult from '../components/searchResult';
import TransactionDashboard from '../components/transactionDashboard';
import AccountTransactions from '../components/accountTransactions';
import Delegates from '../components/delegates';
import Voting from '../components/voting';
import SingleTransaction from '../components/singleTransactionV2';
import HwWalletLogin from '../components/hwWalletLogin';
// import NotFound from '../components/notFound';
import AccountVisualDemo from '../components/accountVisual/demo';
import SendV2 from '../components/sendV2/send';
import Splashscreen from '../components/splashscreen';
import Register from '../components/register/register';
import LoginV2 from '../components/loginV2';
import Extensions from '../components/extensions';
import TermsOfUse from '../components/termsOfUse';
import ToolboxDemo from '../components/toolbox/demo';
import Dashboard from '../components/dashboard';
import DelegateRegistration from '../components/delegateRegistration';

export default {
  accountVisualDemo: {
    path: '/account-visual-demo',
    component: AccountVisualDemo,
    isPrivate: true,
    isV2Layout: true,
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
  send: {
    path: '/wallet/send',
    component: SendV2,
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
  },
  delegates: {
    path: '/delegates',
    component: Delegates,
    isPrivate: false,
  },
  help: {
    path: '/help',
    component: Help,
    isPrivate: false,
  },
  sidechains: {
    path: '/sidechains',
    component: Sidechains,
    isPrivate: true,
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
  },
  signMessage: {
    path: '/sign-message',
    component: SignMessage,
    isPrivate: true,
  },
  registerDelegate: {
    path: '/register-delegate',
    component: DelegateRegistration,
    isLoaded: true,
    isPrivate: false,
  },
  delegateRegistration: {
    path: '/delegate-register',
    component: DelegateRegistration,
    isLoaded: true,
    isPrivate: false,
  },
  addAccount: {
    path: '/add-account',
    component: LoginV2,
    isLoaded: true,
    isPrivate: false,
  },
  extensions: {
    path: '/extensions',
    component: Extensions,
    isPrivate: false,
  },
  // notFound: {
  //   path: '*',
  //   component: NotFound,
  //   isPrivate: false,
  // },
  search: {
    name: 'search',
    pathPrefix: '',
    path: '/explorer/result',
    pathSuffix: '/:query?',
    component: SearchResult,
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
    isV2Layout: true,
    isPrivate: false,
  },
  // notFoundExplorer: {
  //   pathPrefix: '/explorer',
  //   path: '*',
  //   component: NotFound,
  //   isPrivate: false,
  // },
  splashscreen: {
    path: '/',
    component: Splashscreen,
    isPrivate: false,
    isV2Layout: true,
    exact: true,
  },
  register: {
    path: '/register',
    component: Register,
    isPrivate: false,
    isV2Layout: true,
  },
  loginV2: {
    path: '/login',
    component: LoginV2,
    isPrivate: false,
    isV2Layout: true,
  },
  termsOfUse: {
    path: '/terms-of-use',
    component: TermsOfUse,
    isPrivate: false,
    isV2Layout: true,
  },
};
