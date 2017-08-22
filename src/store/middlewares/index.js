import metronomeMiddleware from './metronome';
import accountMiddleware from './account';
import loginMiddleware from './login';
import loadingBarMiddleware from './loadingBar';
import offlineMiddleware from './offline';
import notificationMiddleware from './notification';

export default [
  loginMiddleware,
  metronomeMiddleware,
  accountMiddleware,
  loadingBarMiddleware,
  offlineMiddleware,
  notificationMiddleware,
];
