import { actionTypes } from '@constants';

const watchList = (state = [], action) => {
  switch (action.type) {
    case actionTypes.watchListRetrieved:
      return action.data;

    case actionTypes.addedToWatchList:
      return Array.from(new Set([...state, action.data.address]));

    case actionTypes.removedFromWatchList:
      return state.filter(address => address !== action.data.address);

    default:
      return state;
  }
};

export default watchList;
