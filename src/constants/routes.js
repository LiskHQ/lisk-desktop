import Dashboard from '../components/dashboard';
import Help from '../components/help';
import Sidechains from '../components/sidechains';
import Setting from '../components/setting';
import Login from '../components/login';
import Register from '../components/register';
import RegisterDelegate from '../components/registerDelegate';
import SecondPassphrase from '../components/secondPassphrase';
import SignMessage from '../components/signMessage';
import SearchResult from '../components/searchResult';
import TransactionDashboard from '../components/transactionDashboard';
import AccountTransactions from '../components/accountTransactions';
import Voting from '../components/voting';
import SingleTransaction from '../components/singleTransaction';
import HwWallet from '../components/hwWallet';
// import NotFound from '../components/notFound';
import AccountVisualDemo from '../components/accountVisual/demo';
import Receive from '../components/receive';
import Send from '../components/sendNew';

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
  },
  request: {
    path: '/request',
    component: Receive,
  send: {
    path: '/send',
    component: Send,
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
  register: {
    path: '/register',
    component: Register,
    isLoaded: true,
    isPrivate: false,
  },
  registerDelegate: {
    path: '/register-delegate',
    component: RegisterDelegate,
    isLoaded: true,
    isPrivate: false,
  },
  addAccount: {
    path: '/add-account',
    component: Login,
    isLoaded: true,
    isPrivate: false,
  },
  login: {
    path: '/',
    component: Login,
    isLoaded: true,
    isPrivate: false,
    exact: true,
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
};
