import thunk from 'redux-thunk';
import metronomeMiddleware from './metronome';
import accountMiddleware from './account';
import loginMiddleware from './login';
import addedTransactionMiddleware from './addedTransaction';

export default [
  thunk,
  addedTransactionMiddleware,
  loginMiddleware,
  metronomeMiddleware,
  accountMiddleware,
];
