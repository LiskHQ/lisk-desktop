import actionsType from '../../constants/actions';

const ignoredLoadingActionKeys = [
  'transactions', // because this is called every 10 seconds and the app doesn't look good with so much loading going on.
];

const loadingBarMiddleware = () => next => (action) => {
  switch (action.type) {
    case actionsType.loadingStarted:
    case actionsType.loadingFinished:
      if (ignoredLoadingActionKeys.indexOf(action.data) === -1) {
        next(action);
      }
      break;
    default:
      next(action);
      break;
  }
};

export default loadingBarMiddleware;

