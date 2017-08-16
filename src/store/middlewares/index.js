import metronomeMiddleware from './metronome';
import accountMiddleware from './account';
import loginMiddleware from './login';
import offlineMiddleware from './offline';

export default [
  loginMiddleware,
  metronomeMiddleware,
  accountMiddleware,
  offlineMiddleware,
];
