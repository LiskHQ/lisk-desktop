import actionTypes from '../constants/actions';
import liskServiceApi from '../../src/utils/api/liskService';

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
    dispatch(addNewsFeed(error));
  }).finally(() => {
    // To prevent dispalying empty View before fetching data
    dispatch(showEmptyNewsFeedState({ showNewsFeedEmptyState: true }));
  });
};

export const getPriceTicker = () => (dispatch) => {
  liskServiceApi.getPriceTicker().then((response) => {
    dispatch(addPriceTicker({ ...response }));
  }).catch((error) => {
    dispatch(addPriceTicker({ error }));
  });
};
