import MetronomeService from '../../utils/metronome';
import actionTypes from '../../constants/actions';

const metronomeMiddleware = (store) => {
  const metronome = new MetronomeService(store.dispatch);
  return next => (action) => {
    switch (action.type) {
      case actionTypes.accountLoggedIn:
        metronome.init();
        break;
      case actionTypes.accountLoggedOut:
        metronome.terminate();
        break;
      default: break;
    }
    next(action);
  };
};

export default metronomeMiddleware;
