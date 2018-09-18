import thunk from 'redux-thunk';
import peersMiddleware from './peers';
import accountMiddleware from './account';
import loginMiddleware from './login';
import loadingBarMiddleware from './loadingBar';
import offlineMiddleware from './offline';
// ToDo : enable this one when you solve the problem with multi account management
// import notificationMiddleware from './notification';
import votingMiddleware from './voting';
import followedAccountsMiddleware from './followedAccounts';
import socketMiddleware from './socket';

export default [
  thunk,
  peersMiddleware,
  loginMiddleware,
  socketMiddleware,
  accountMiddleware,
  loadingBarMiddleware,
  offlineMiddleware,
  // notificationMiddleware,
  votingMiddleware,
  followedAccountsMiddleware,
];
