import thunk from 'redux-thunk';
import peersMiddleware from './peers';
import accountMiddleware from './account';
import loadingBarMiddleware from './loadingBar';
import offlineMiddleware from './offline';
import hwWalletMiddleware from './hwWallet';
// ToDo : enable this one when you solve the problem with multi account management
// import notificationMiddleware from './notification';
import votingMiddleware from './voting';
import followedAccountsMiddleware from './followedAccounts';
import socketMiddleware from './socket';

export default [
  // notificationMiddleware,
  accountMiddleware,
  followedAccountsMiddleware,
  hwWalletMiddleware,
  loadingBarMiddleware,
  offlineMiddleware,
  peersMiddleware,
  socketMiddleware,
  thunk,
  votingMiddleware,
];
