import {
  getDelegates,
} from '../utils/api/delegate';
import actionTypes from '../constants/actions';

/**
 * Pass response from getDelegates to reducers
 */
export const delegateRetrieved = data => ({
  type: actionTypes.delegateRetrieved,
  data,
});

/**
 * Set a flag until response from getDelegates is resolved
 */
export const delegateRetrieving = data => ({
  type: actionTypes.delegateRetrieving,
  data,
});

/**
 * Retrieves delegates matching a username
 */
export const delegatesFetched = ({ username }) =>
  (dispatch, getState) => {
    const liskAPIClient = getState().peers.liskAPIClient;
    dispatch(delegateRetrieving());
    getDelegates(liskAPIClient, { username })
      .then((response) => {
        if (response.data.length > 0) {
          dispatch(delegateRetrieved({ delegate: response.data[0], username }));
        } else {
          dispatch(delegateRetrieved({ delegate: null, username }));
        }
      });
  };

export const delegateRegisteredFailure = data => ({
  type: actionTypes.delegateRegisteredFailure,
  data,
});
