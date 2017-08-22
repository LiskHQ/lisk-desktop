import thunk from 'redux-thunk';
import metronomeMiddleware from './metronome';
import accountMiddleware from './account';
import loginMiddleware from './login';
import addedTransactionMiddleware from './addedTransaction';
import offlineMiddleware from './offline';
import notificationMiddleware from './notification';

export default [
  thunk,
  addedTransactionMiddleware,
  loginMiddleware,
  metronomeMiddleware,
  accountMiddleware,
  offlineMiddleware,
  notificationMiddleware,
];
