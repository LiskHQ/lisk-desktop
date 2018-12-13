import {
  getDelegate,
} from '../utils/api/delegate';
import actionTypes from '../constants/actions';

/**
 * Pass response from getDelegate to reducers
 */
export const delegateRetrieved = data => ({
  type: actionTypes.delegateRetrieved,
  data,
});

/**
 * Set a flag until response from getDelegate is resolved
 */
export const delegateRetrieving = data => ({
  type: actionTypes.delegateRetrieving,
  data,
});

/**
 * Retrieves delegates matching a username
 */
export const delegatesFetched = ({ username }) => (dispatch, getState) => {
  const liskAPIClient = getState().peers.liskAPIClient;
  dispatch(delegateRetrieving());
  getDelegate(liskAPIClient, { username })
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
