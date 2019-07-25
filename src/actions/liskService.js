import actionTypes from '../constants/actions';
import liskServiceApi from '../utils/api/lsk/liskService';


// TODO Remove Since the currency graph is not used anymore
export const addDataToCurrencyGraph = data => ({
  type: actionTypes.addDataToCurrencyGraph,
  data,
});

// TODO Remove Since the currency graph is not used anymore
export const addErrorToCurrencyGraph = data => ({
  type: actionTypes.addErrorToCurrencyGraph,
  data,
});

// TODO Remove Since the currency graph is not used anymore
export const clearDataOfCurrencyGraph = () => ({
  type: actionTypes.clearDataOfCurrencyGraph,
});

// TODO Update to HOC to load newsFeed only when needed
export const addNewsFeed = data => ({
  type: actionTypes.getNewsFeed,
  data,
});

// TODO Update to HOC to load newsFeed only when needed
export const showEmptyNewsFeedState = data => ({
  type: actionTypes.showEmptyNewsFeed,
  data,
});

// TODO Remove Since priceTicker was moved to service already
export const addPriceTicker = data => ({
  type: actionTypes.addPriceTicker,
  data,
});

// TODO Remove Since the currency graph is not used anymore
export const getCurrencyGraphData = step => (dispatch) => {
  dispatch(clearDataOfCurrencyGraph());
  liskServiceApi.getCurrencyGraphData(step).then((response) => {
    dispatch(addDataToCurrencyGraph({ response, step }));
  }).catch((error) => {
    dispatch(addErrorToCurrencyGraph(error));
  });
};

// TODO Update to HOC to load newsFeed only when needed
export const getNewsFeed = () => (dispatch) => {
  liskServiceApi.getNewsFeed().then((newsFeed) => {
    dispatch(addNewsFeed(newsFeed));
  }).catch((error) => {
    dispatch(showEmptyNewsFeedState({ showNewsFeedEmptyState: true }));
    throw new Error(error);
  });
};

// TODO Remove Since priceTicker was moved to service already
export const getPriceTicker = () => (dispatch) => {
  liskServiceApi.getPriceTicker().then((response) => {
    dispatch(addPriceTicker({ ...response }));
  }).catch((error) => {
    dispatch(addPriceTicker({ error }));
  });
};
