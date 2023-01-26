import { getFromStorage } from 'src/utils/localJSONStorage';
import actionTypes from './actionTypes';

export const watchListRetrieved = () => (dispatch) => {
  getFromStorage('validatorWatchList', [], (data) => {
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
