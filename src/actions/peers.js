import Lisk from 'lisk-js';
import actionTypes from '../constants/actions';

/**
 * Returns required action object to set
 * the given peer data as active peer
 * This should be called once in login page
 *
 * @param {Object} data - Active peer data and the passphrase of account
 * @returns {Object} Action object
 */
export const activePeerSet = (data) => {
  const addHttp = (url) => {
    const reg = /^(?:f|ht)tps?:\/\//i;
    return reg.test(url) ? url : `http://${url}`;
  };

  const { network } = data;
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

  return {
    data: Object.assign({
      passphrase: data.passphrase,
      publicKey: data.publicKey,
      activePeer: Lisk.api(config),
    }),
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
