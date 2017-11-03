import thunk from 'redux-thunk';
import accountMiddleware from './account';
import loginMiddleware from './login';
import transactionsMiddleware from './transactions';
import loadingBarMiddleware from './loadingBar';
import offlineMiddleware from './offline';
import notificationMiddleware from './notification';
import votingMiddleware from './voting';
import savedAccountsMiddleware from './savedAccounts';
import socketMiddleware from './socket';

export default [
  thunk,
  transactionsMiddleware,
  loginMiddleware,
  socketMiddleware,
  accountMiddleware,
  loadingBarMiddleware,
  offlineMiddleware,
  notificationMiddleware,
  votingMiddleware,
  savedAccountsMiddleware,
];
