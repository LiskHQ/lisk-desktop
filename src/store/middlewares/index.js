import thunk from 'redux-thunk';
import metronomeMiddleware from './metronome';
import accountMiddleware from './account';
import loginMiddleware from './login';
import addedTransactionMiddleware from './addedTransaction';
import loadingBarMiddleware from './loadingBar';
import offlineMiddleware from './offline';
import notificationMiddleware from './notification';
import votingMiddleware from './voting';
import savedAccountsMiddleware from './savedAccounts';

export default [
  thunk,
  addedTransactionMiddleware,
  loginMiddleware,
  metronomeMiddleware,
  accountMiddleware,
  loadingBarMiddleware,
  offlineMiddleware,
  notificationMiddleware,
  votingMiddleware,
  savedAccountsMiddleware,
];
