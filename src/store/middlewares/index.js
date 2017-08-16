import metronomeMiddleware from './metronome';
import accountMiddleware from './account';
import loginMiddleware from './login';
import addedTransactionMiddleware from './addedTransaction';

export default [
  addedTransactionMiddleware,
  loginMiddleware,
  metronomeMiddleware,
  accountMiddleware,
];
