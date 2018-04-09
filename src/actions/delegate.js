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
      activePeer, {
        q: {
          username,
        },
      },
    ).then(({ delegate }) => {
      dispatch(delegatesRetrieved({ delegate }));
    });
  };
