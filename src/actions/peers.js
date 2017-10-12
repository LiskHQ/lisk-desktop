import Lisk from 'lisk-js';
import actionTypes from '../constants/actions';
import { getNetHash } from './../utils/api/peers';

const peerSet = (data, config) => ({
  data: Object.assign({
    passphrase: data.passphrase,
    publicKey: data.publicKey,
    activePeer: Lisk.api(config),
  }),
  type: actionTypes.activePeerSet,
});

/**
 * Returns required action object to set
 * the given peer data as active peer
 * This should be called once in login page
 *
 * @param {Object} data - Active peer data and the passphrase of account
 * @returns {Object} Action object
 */
export const activePeerSet = data =>
  (dispatch) => {
    const addHttp = (url) => {
      const reg = /^(?:f|ht)tps?:\/\//i;
      return reg.test(url) ? url : `http://${url}`;
    };
    const config = data.network || {};

    if (config.address) {
      const { hostname, port, protocol } = new URL(addHttp(config.address));

      config.node = hostname;
      config.port = port;
      config.ssl = protocol === 'https';
    }
    if (config.testnet === undefined && config.port !== undefined) {
      config.testnet = config.port === '7000';
    }
    if (config.custom) {
      getNetHash(Lisk.api(config)).then((response) => {
        config.nethash = response.nethash;
        dispatch(peerSet(data, config));
      });
    } else {
      dispatch(peerSet(data, config));
    }
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
