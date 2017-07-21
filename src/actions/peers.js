import Lisk from 'lisk-js';
import actionTypes from '../constants/actions';

/**
 * Returns required action object to set
 * the given peer data as active peer
 *
 * @param {Object} data - Active peer data
 * @returns {Object} Action object
 */
export const activePeerSet = (network) => {
  const addHttp = (url) => {
    const reg = /^(?:f|ht)tps?:\/\//i;
    return reg.test(url) ? url : `http://${url}`;
  };

  // this.network = network;
  let config = { };
  if (network) {
    config = network;
    if (network.address) {
      const normalizedUrl = new URL(addHttp(network.address));

      config.node = normalizedUrl.hostname;
      config.port = normalizedUrl.port;
      config.ssl = normalizedUrl.protocol === 'https';
    }
    if (config.testnet === undefined && config.port !== undefined) {
      config.testnet = config.port === '7000';
    }
  }

  const data = Lisk.api(config);

  return {
    data,
    type: actionTypes.activePeerSet,
  };
};

/**
 * Returns required action object to partially
 * update the active peer
 *
 * @param {Object} data - Active peer data
 * @returns {Object} Action object
 */
export const activePeerUpdate = data => ({
  data,
  type: actionTypes.activePeerUpdate,
});

/**
 * Returns required action object to set
 * the given peers data as active peer
 *
 * @param {Object} data - Active peer data
 * @returns {Object} Action object
 */
export const activePeerReset = () => ({
  type: actionTypes.activePeerReset,
});
