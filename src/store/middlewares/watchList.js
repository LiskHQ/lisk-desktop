import { actionTypes } from '@constants';
import { setInStorage } from '@utils/localJSONStorage';

const watchList = ({ getState }) => next => (action) => {
  switch (action.type) {
    case actionTypes.addedToWatchList:
    case actionTypes.removedFromWatchList:
      next(action);
      setInStorage('delegateWatchList', getState().watchList);
      break;

    default:
      next(action);
      break;
  }
};

export default watchList;
