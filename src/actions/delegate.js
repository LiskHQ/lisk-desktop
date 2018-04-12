import {
  getDelegate,
} from '../utils/api/delegate';
import actionTypes from '../constants/actions';

/**
 * Add data to the list of all delegates
 */
export const delegatesRetrieved = data => ({
  type: actionTypes.delegatesRetrieved,
  data,
});

/**
 * Gets list of all delegates
 */
export const delegatesFetched = ({ activePeer, username }) =>
  (dispatch) => {
    getDelegate(
      activePeer, { username },
    ).then(({ delegate }) => {
      dispatch(delegatesRetrieved({ delegate, username }));
    }).catch(() => {
      dispatch(delegatesRetrieved({ delegate: undefined, username }));
    });
  };


export const delegateRegisteredSuccess = data => ({
  type: actionTypes.delegateRegisteredSuccess,
  data,
});

export const delegateRegisteredFailure = data => ({
  type: actionTypes.delegateRegisteredFailure,
  data,
});
