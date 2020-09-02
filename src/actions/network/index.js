import { networkSet as lskNetworkSet } from './lsk';
import actionTypes from '../../constants/actions';


export const networkSet = async data =>
  async (dispatch) => {
    [
      lskNetworkSet,
      // here is the place to add a new token
    ].map(async action => dispatch(await action(data)));
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
