import thunk from 'redux-thunk';
import peersMiddleware from './peers';
import accountMiddleware from './account';
import loadingBarMiddleware from './loadingBar';
import offlineMiddleware from './offline';
import loginMiddleware from './login';
// ToDo : enable this one when you solve the problem with multi account management
// import notificationMiddleware from './notification';
import votingMiddleware from './voting';
import followedAccountsMiddleware from './followedAccounts';
import socketMiddleware from './socket';

export default [
  thunk,
  peersMiddleware,
  socketMiddleware,
  accountMiddleware,
  loadingBarMiddleware,
  offlineMiddleware,
  loginMiddleware,
  // notificationMiddleware,
  votingMiddleware,
  followedAccountsMiddleware,
];
