import actionTypes from '../actions/actionTypes';

const ignoredLoadingActionKeys = [
  'transactions',
];

const loadingBarMiddleware = () => next => (action) => {
  switch (action.type) {
    case actionTypes.loadingStarted:
    case actionTypes.loadingFinished:
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
