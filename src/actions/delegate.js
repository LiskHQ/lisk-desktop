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
export const delegatesFetched = ({ activePeer, username }) =>
  (dispatch) => {
    dispatch(delegatesRetrieving());
    getDelegate(activePeer, { username }).then(({ delegate }) => {
      dispatch(delegatesRetrieved({ delegate, username }));
    }).catch(() => {
      dispatch(delegatesRetrieved({ delegate: null, username }));
    });
  };

export const delegateRegisteredFailure = data => ({
  type: actionTypes.delegateRegisteredFailure,
  data,
});
