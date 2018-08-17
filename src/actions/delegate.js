import {
  getDelegate,
} from '../utils/api/delegate';
import actionTypes from '../constants/actions';

/**
 * Pass response from getDelegate to reducers
 */
export const delegatesRetrieved = data => ({
  type: actionTypes.delegatesRetrieved,
  data,
});

/**
 * Set a flag until response from getDelegate is resolved
 */
export const delegatesRetrieving = data => ({
  type: actionTypes.delegatesRetrieving,
  data,
});

/**
 * Retrieves delegates matching a username
 */
export const delegatesFetched = ({ username }) =>
  (dispatch, getState) => {
    const activePeer = getState().peers.data;
    dispatch(delegatesRetrieving());
    getDelegate(activePeer, { username })
      .then((response) => {
        if (response.data.length > 0) {
          dispatch(delegatesRetrieved({ delegate: response.data[0], username }));
        } else {
          dispatch(delegatesRetrieved({ delegate: null, username }));
        }
      });
  };

export const delegateRegisteredFailure = data => ({
  type: actionTypes.delegateRegisteredFailure,
  data,
});
