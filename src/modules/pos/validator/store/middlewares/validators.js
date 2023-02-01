import { setInStorage } from 'src/utils/localJSONStorage';
import actionTypes from '../actions/actionTypes';
import { stakesConfirmed } from '../actions/staking';

const validatorsMiddleware =
  ({ getState, dispatch }) =>
  (next) =>
  (action) => {
    switch (action.type) {
      case actionTypes.addedToWatchList:
      case actionTypes.removedFromWatchList:
        next(action);
        setInStorage('validatorWatchList', getState().watchList);
        break;

      case actionTypes.stakesSubmitted:
        next(action);
        dispatch(stakesConfirmed());
        break;

      default:
        next(action);
        break;
    }
  };

export default validatorsMiddleware;
