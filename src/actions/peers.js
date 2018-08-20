import i18next from 'i18next';
import Lisk from 'lisk-elements';
import actionTypes from '../constants/actions';
import networks from '../constants/networks';
import { errorToastDisplayed } from './toaster';
import { loadingStarted, loadingFinished } from '../actions/loading';

const peerSet = (data, config) => ({
  data: Object.assign({
    passphrase: data.passphrase,
    publicKey: data.publicKey,
    activePeer: new Lisk.APIClient(config.nodes, { nethash: config.nethash }),
    options: config,
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
    const config = data.network || {};

    if (config.address) {
      config.nodes = [config.address];
    } else if (config.testnet) {
      config.nethash = Lisk.APIClient.constants.TESTNET_NETHASH;
      config.nodes = networks.testnet.nodes;
    } else {
      config.nethash = Lisk.APIClient.constants.MAINNET_NETHASH;
      config.nodes = networks.mainnet.nodes;
    }

    if (config.custom) {
      const liskAPIClient = new Lisk.APIClient(config.nodes, {});
      loadingStarted('getConstants');
      liskAPIClient.node.getConstants().then((response) => {
        dispatch(loadingFinished('getConstants'));
        config.nethash = response.data.nethash;
        dispatch(peerSet(data, config));
      }).catch(() => {
        dispatch(loadingFinished('getConstants'));
        dispatch(errorToastDisplayed({ label: i18next.t('Unable to connect to the node') }));
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
