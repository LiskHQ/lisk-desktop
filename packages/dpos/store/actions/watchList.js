import actionTypes from './actionTypes';
import { getFromStorage } from '@common/utilities/localJSONStorage';

export const watchListRetrieved = () => (dispatch) => {
  getFromStorage('delegateWatchList', [], (data) => {
    dispatch({
      type: actionTypes.watchListRetrieved,
      data: data || [],
    });
  });
};

export const addedToWatchList = ({ address }) => ({
  data: { address },
  type: actionTypes.addedToWatchList,
});

export const removedFromWatchList = ({ address }) => ({
  data: { address },
  type: actionTypes.removedFromWatchList,
});
