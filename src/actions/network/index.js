import actionTypes from '../../constants/actions';
import { tokenKeys } from '../../constants/tokens';
import { getNetworkConfig } from '../../utils/api/network';

/**
 *
 * @param {Object} data
 * @param {String} data.name the network name
 * @param {String} data.address the network address
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
 *
 * @param {Object} data - Active network data
 * @returns {Object} Action object
 */
export const networkStatusUpdated = data => ({
  data,
  type: actionTypes.networkStatusUpdated,
});

export const networkSelected = data => ({
  data,
  type: actionTypes.networkSelected,
});
