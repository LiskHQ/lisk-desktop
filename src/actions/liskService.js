import actionTypes from '../constants/actions';
import liskServiceApi from '../utils/api/lsk/liskService';

export const addDataToCurrencyGraph = data => ({
  type: actionTypes.addDataToCurrencyGraph,
  data,
});

export const addErrorToCurrencyGraph = data => ({
  type: actionTypes.addErrorToCurrencyGraph,
  data,
});

export const clearDataOfCurrencyGraph = () => ({
  type: actionTypes.clearDataOfCurrencyGraph,
});

export const addNewsFeed = data => ({
  type: actionTypes.getNewsFeed,
  data,
});

export const showEmptyNewsFeedState = data => ({
  type: actionTypes.showEmptyNewsFeed,
  data,
});

export const addPriceTicker = data => ({
  type: actionTypes.addPriceTicker,
  data,
});

export const getCurrencyGraphData = step => (dispatch) => {
  dispatch(clearDataOfCurrencyGraph());
  liskServiceApi.getCurrencyGraphData(step).then((response) => {
    dispatch(addDataToCurrencyGraph({ response, step }));
  }).catch((error) => {
    dispatch(addErrorToCurrencyGraph(error));
  });
};

export const getNewsFeed = () => (dispatch) => {
  liskServiceApi.getNewsFeed().then((newsFeed) => {
    dispatch(addNewsFeed(newsFeed));
  }).catch((error) => {
    dispatch(showEmptyNewsFeedState({ showNewsFeedEmptyState: true }));
    throw new Error(error);
  });
};

export const getPriceTicker = () => (dispatch) => {
  liskServiceApi.getPriceTicker().then((response) => {
    dispatch(addPriceTicker({ ...response }));
  }).catch((error) => {
    dispatch(addPriceTicker({ error }));
  });
};
