import thunk from 'redux-thunk';
import metronomeMiddleware from './metronome';
import accountMiddleware from './account';
import loginMiddleware from './login';
import addedTransactionMiddleware from './addedTransaction';
import loadingBarMiddleware from './loadingBar';
import offlineMiddleware from './offline';
import notificationMiddleware from './notification';

export default [
  thunk,
  addedTransactionMiddleware,
  loginMiddleware,
  metronomeMiddleware,
  accountMiddleware,
  loadingBarMiddleware,
  offlineMiddleware,
  notificationMiddleware,
];
