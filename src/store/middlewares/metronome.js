import MetronomeService from '../../utils/metronome';
import actionTypes from '../../constants/actions';

const metronomeMiddleware = (store) => {
  const metronome = new MetronomeService(store.dispatch);
  // TODO: call metronome.init on login success event
  metronome.init();
  return next => (action) => {
    switch (action.type) {
      case actionTypes.accountLoggedOut:
        metronome.terminate();
        break;
      default: break;
    }
    next(action);
  };
};

export default metronomeMiddleware;
