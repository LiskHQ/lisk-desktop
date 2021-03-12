import actionTypes from 'constants';
import { tokenKeys } from 'constants';
import { getNetworkConfig } from '../utils/api/network';

/**
 * call this action with a network name and address to update the
 * network config in the redux store
 * @param {Object} data - the network data
 * @param {String} data.name - the network name
 * @param {String} data.address - the network address
 * @returns {Object} - the action object
 */
export const networkConfigSet = async (data) => {
  const promises = tokenKeys.map(token => getNetworkConfig(data, token));
  const networks = await Promise.all(promises);
  const networksWithNames = tokenKeys.reduce((acc, token, index) =>
    ({ ...acc, [token]: networks[index] }), {});
  return {
    type: actionTypes.networkConfigSet,
    data: { name: data.name, networks: networksWithNames },
  };
};


/**
 * Returns required action object to update offline/online status of network
 * @param {Object} data - active network data
 * @returns {Object} the action object
 */
export const networkStatusUpdated = data => ({
  data,
  type: actionTypes.networkStatusUpdated,
});

/**
 * Returns required action object to call other actions dependant on
 * the user-selected network
 * @param {Object} data - user selected network
 * @param {String} data.name - the network name
 * @param {String} data.address - the network address
 * @returns {Object} the action object
 */
export const networkSelected = data => ({
  data,
  type: actionTypes.networkSelected,
});
