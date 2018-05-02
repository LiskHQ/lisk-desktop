import Login from '../components/login';
import Register from '../components/register';
// import NotFound from '../components/notFound';
import asyncComponent from '../components/asyncComponent';

const Dashboard = asyncComponent(() => import('../components/dashboard'));
const AccountVisualDemo = asyncComponent(() => import('../components/accountVisual/demo'));
const TransactionDashboard = asyncComponent(() => import('../components/transactionDashboard'));
const Voting = asyncComponent(() => import('../components/voting'));
const Sidechains = asyncComponent(() => import('../components/sidechains'));
const SecondPassphrase = asyncComponent(() => import('../components/secondPassphrase'));
const Search = asyncComponent(() => import('../components/search'));
const SearchResult = asyncComponent(() => import('../components/search/searchResult'));
const AccountTransactions = asyncComponent(() => import('../componetns/accountTransactions'));
const SingleTransaction = asyncComponent(() => import('../components/singleTransaction'));
const RegisterDelegate = asyncComponent(() => import('../components/registerDelegate'));

export default {
  accountVisualDemo: {
    path: '/account-visual-demo',
    component: AccountVisualDemo,
    isPrivate: true,
  },
  dashboard: {
    path: '/dashboard',
    component: Dashboard,
    isPrivate: true,
  },
  wallet: {
    path: '/wallet',
    component: TransactionDashboard,
    isPrivate: true,
  },
  delegates: {
    path: '/delegates',
    component: Voting,
    isPrivate: true,
  },
  sidechains: {
    path: '/sidechains',
    component: Sidechains,
    isPrivate: true,
  },
  secondPassphrase: {
    path: '/second-passphrase',
    component: SecondPassphrase,
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
    pathPrefix: '/explorer',
    path: '/search',
    component: Search,
    isPrivate: false,
  },
  searchResult: {
    name: 'searchResult',
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
