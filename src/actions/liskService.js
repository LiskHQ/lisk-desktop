import actionTypes from '../constants/actions';
import liskServiceApi from '../utils/api/lsk/liskService';

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

// TODO Update to HOC to load newsFeed only when needed
export const getNewsFeed = () => (dispatch) => {
  liskServiceApi.getNewsFeed().then((newsFeed) => {
    dispatch(addNewsFeed(newsFeed));
  }).catch((error) => {
    dispatch(showEmptyNewsFeedState({ showNewsFeedEmptyState: true }));
    throw new Error(error);
  });
};
