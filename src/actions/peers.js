import i18next from 'i18next';
import Lisk from 'lisk-js';
import actionTypes from '../constants/actions';
import { getNethash } from './../utils/api/nethash';
import { errorToastDisplayed } from './toaster';
import netHashes from '../constants/netHashes';
import networks from '../constants/networks';

const peerSet = (data, config) => ({
  data: Object.assign({
    passphrase: data.passphrase,
    publicKey: data.publicKey,
    activePeer: Lisk.api(config),
    noSavedAccounts: data.noSavedAccounts,
  }),
  type: actionTypes.activePeerSet,
});

const pickMainnetNode = () => {
  const nodes = [
    'hub21.lisk.io',
    'hub22.lisk.io',
    'hub23.lisk.io',
    'hub24.lisk.io',
    'hub25.lisk.io',
    'hub26.lisk.io',
    'hub27.lisk.io',
    'hub28.lisk.io',
    'hub31.lisk.io',
    'hub32.lisk.io',
    'hub33.lisk.io',
    'hub34.lisk.io',
    'hub35.lisk.io',
    'hub36.lisk.io',
    'hub37.lisk.io',
    'hub38.lisk.io',
  ];
  return nodes[Math.floor(Math.random() * nodes.length) % nodes.length];
};

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
    if (config.code === networks.mainnet.code) {
      config.node = pickMainnetNode();
    }


    if (config.address) {
      const { hostname, port, protocol } = new URL(addHttp(config.address));

      config.node = hostname;
      config.ssl = protocol === 'https:';
      config.port = port || (config.ssl ? 443 : 80);
    }
    if (config.testnet === undefined && config.port !== undefined) {
      config.testnet = config.port === '7000';
    }
    if (config.custom) {
      getNethash(Lisk.api(config)).then((response) => {
        config.testnet = response.nethash === netHashes.testnet;
        if (!config.testnet && response.nethash !== netHashes.mainnet) {
          config.nethash = response.nethash;
        }
        dispatch(peerSet(data, config));
      }).catch(() => {
        if (!data.noSavedAccounts) {
          dispatch(errorToastDisplayed({ label: i18next.t('Unable to connect to the node') }));
        }
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
