import Dashboard from '../components/dashboard';
import Help from '../components/help';
import Sidechains from '../components/sidechains';
import Setting from '../components/setting';
import RegisterDelegate from '../components/registerDelegate';
import SecondPassphrase from '../components/secondPassphrase';
import SignMessage from '../components/signMessage';
import SearchResult from '../components/searchResult';
import TransactionDashboard from '../components/transactionDashboard';
import AccountTransactions from '../components/accountTransactions';
import Voting from '../components/voting';
import SingleTransaction from '../components/singleTransactionV2';
import HwWallet from '../components/hwWallet';
// import NotFound from '../components/notFound';
import AccountVisualDemo from '../components/accountVisual/demo';
import SendV2 from '../components/sendV2';
import Send from '../components/send';
import Splashscreen from '../components/splashscreen';
import RegistrationV2 from '../components/registerV2/registerV2';
import LoginV2 from '../components/loginV2';
import TermsOfUse from '../components/termsOfUse';

export default {
  accountVisualDemo: {
    path: '/account-visual-demo',
    component: AccountVisualDemo,
    isPrivate: true,
  },
  dashboard: {
    path: '/dashboard',
    component: Dashboard,
    isPrivate: false,
  },
  wallet: {
    path: '/wallet',
    component: TransactionDashboard,
    isPrivate: true,
    exact: true,
  },
  send: {
    path: '/wallet/send',
    component: Send,
    isPrivate: true,
  },
  sendV2: {
    path: '/wallet/sendV2',
    component: SendV2,
    isPrivate: true,
  },
  delegates: {
    path: '/delegates',
    component: Voting,
    isPrivate: true,
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
    path: '/setting',
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
    component: RegisterDelegate,
    isLoaded: true,
    isPrivate: false,
  },
  addAccount: {
    path: '/add-account',
    component: LoginV2,
    isLoaded: true,
    isPrivate: false,
  },
  // notFound: {
  //   path: '*',
  //   component: NotFound,
  //   isPrivate: false,
  // },
  search: {
    name: 'search',
    pathPrefix: '/explorer',
    path: '/result',
    pathSuffix: '/:query?',
    component: SearchResult,
    isPrivate: false,
  },
  accounts: {
    pathPrefix: '/explorer',
    path: '/accounts',
    pathSuffix: '/:address?',
    component: AccountTransactions,
    isPrivate: false,
  },
  accountsV2: {
    pathPrefix: '/explorer',
    path: '/accountsV2',
    pathSuffix: '/:address?',
    component: AccountTransactions,
    isPrivate: false,
  },
  transactions: {
    pathPrefix: '/explorer',
    path: '/transactions',
    pathSuffix: '/:id?',
    component: SingleTransaction,
    isPrivate: false,
  },
  hwWallet: {
    path: '/hw-walet-login',
    component: HwWallet,
    isPrivate: false,
  },
  // notFoundExplorer: {
  //   pathPrefix: '/explorer',
  //   path: '*',
  //   component: NotFound,
  //   isPrivate: false,
  // },
  explorer: {
    path: '/explorer',
  },
  splashscreen: {
    path: '/',
    component: Splashscreen,
    isPrivate: false,
    isV2Layout: true,
    exact: true,
  },
  registerV2: {
    path: '/register',
    component: RegistrationV2,
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
