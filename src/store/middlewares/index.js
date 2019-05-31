import thunk from 'redux-thunk';
import peersMiddleware from './peers';
import accountMiddleware from './account';
import loadingBarMiddleware from './loadingBar';
import offlineMiddleware from './offline';
import hwWalletMiddleware from './hwWallet';
// ToDo : enable this one when you solve the problem with multi account management
// import notificationMiddleware from './notification';
import votingMiddleware from './voting';
import socketMiddleware from './socket';
import settingsMiddleware from './settings';

export default [
  // notificationMiddleware,
  accountMiddleware,
  hwWalletMiddleware,
  loadingBarMiddleware,
  offlineMiddleware,
  peersMiddleware,
  socketMiddleware,
  thunk,
  votingMiddleware,
  settingsMiddleware,
];
