import metronomeMiddleware from './metronome';
import accountMiddleware from './account';
import loginMiddleware from './login';
import notificationMiddleware from './notification';

export default [
  loginMiddleware,
  metronomeMiddleware,
  accountMiddleware,
  notificationMiddleware,
];
