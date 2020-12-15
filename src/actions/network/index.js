import { lskNetworkSet } from './lsk';
import { btcNetworkSet } from './btc';
import actionTypes from '../../constants/actions';

export const networkSet = data => (dispatch) => {
  dispatch(lskNetworkSet(data));
  if (data.name !== 'Custom Node') {
    dispatch(btcNetworkSet(data));
  }
};

/**
 * Returns required action object to update offline/online status of network
 *
 * @param {Object} data - Active network data
 * @returns {Object} Action object
 */
export const networkStatusUpdated = data => ({
  data,
  type: actionTypes.networkStatusUpdated,
});
