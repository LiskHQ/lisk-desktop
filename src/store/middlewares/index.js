import metronomeMiddleware from './metronome';
import accountMiddleware from './account';
import loginMiddleware from './login';

export default [
  loginMiddleware,
  metronomeMiddleware,
  accountMiddleware,
];
