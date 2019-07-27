import thunk from 'redux-thunk';
import accountMiddleware from './account';
import loadingBarMiddleware from './loadingBar';
import offlineMiddleware from './offline';
import hwWalletMiddleware from './hwWallet';
// ToDo : enable this one when you solve the problem with multi account management
// import notificationMiddleware from './notification';
import votingMiddleware from './voting';
import socketMiddleware from './socket';
import settingsMiddleware from './settings';
import bookmarksMiddleware from './bookmarks';

export default [
  // notificationMiddleware,
  accountMiddleware,
  bookmarksMiddleware,
  hwWalletMiddleware,
  loadingBarMiddleware,
  offlineMiddleware,
  settingsMiddleware,
  socketMiddleware,
  thunk,
  votingMiddleware,
];
