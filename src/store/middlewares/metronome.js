import MetronomeService from '../../utils/metronome';

const metronomeMiddleware = (store) => {
  const metronome = new MetronomeService(store.dispatch);
  metronome.init();
  return next => (action) => {
    next(action);
  };
};

export default metronomeMiddleware;
