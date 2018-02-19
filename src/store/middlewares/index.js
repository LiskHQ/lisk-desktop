import thunk from 'redux-thunk';
import peersMiddleware from './peers';
import accountMiddleware from './account';
import loginMiddleware from './login';
import transactionsMiddleware from './transactions';
import loadingBarMiddleware from './loadingBar';
import offlineMiddleware from './offline';
// ToDo : enable this one when you solve the problem with multi account management
// import notificationMiddleware from './notification';
import votingMiddleware from './voting';
import savedAccountsMiddleware from './savedAccounts';
import socketMiddleware from './socket';
import savedSettingsMiddleware from './savedSettings';

export default [
  thunk,
  peersMiddleware,
  transactionsMiddleware,
  loginMiddleware,
  socketMiddleware,
  accountMiddleware,
  loadingBarMiddleware,
  offlineMiddleware,
  // notificationMiddleware,
  votingMiddleware,
  savedAccountsMiddleware,
  savedSettingsMiddleware,
];
