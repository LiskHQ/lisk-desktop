// TODO this file should be removed after the new 'network' actions are used everywhere
/* istanbul ignore file */

import Lisk from 'lisk-elements';
import actionTypes from '../constants/actions';
import networks from '../constants/networks';
import { loadingStarted, loadingFinished } from '../actions/loading';
import { login } from './account';
import { getConnectionErrorMessage } from './network/lsk';
import { errorToastDisplayed } from './toaster';

import { networkSet } from './network';

const peerSet = (data, config) => ({
  data: Object.assign({
    passphrase: data.passphrase,
    publicKey: data.publicKey,
    liskAPIClient: new Lisk.APIClient(config.nodes, { nethash: config.nethash }),
    options: config,
    loginType: data.loginType,
  }),
  type: actionTypes.liskAPIClientSet,
});

/**
 * Returns required action object to set
 * the given peer data as active peer
 * This should be called once in login page
 *
 * @param {Object} data - Active peer data and the passphrase of account
 * @returns {Object} Action object
 */
export const liskAPIClientSet = data =>
  async (dispatch, getState) => { // eslint-disable-line max-statements
    const config = data.network;

    if (config.address) {
      config.nodes = [config.address];
    } else if (config.testnet) {
      config.nethash = Lisk.APIClient.constants.TESTNET_NETHASH;
      config.nodes = networks.testnet.nodes;
    } else {
      config.nethash = Lisk.APIClient.constants.MAINNET_NETHASH;
      config.nodes = networks.mainnet.nodes;
    }
    // TODO calling token-agnostic action inside LSK action is hacky, should be refactored
    dispatch(networkSet({
      ...data.network,
      nodeUrl: data.network.address,
    }));

    if (config.custom) {
      const liskAPIClient = new Lisk.APIClient(config.nodes, {});
      loadingStarted('getConstants');
      liskAPIClient.node.getConstants().then((response) => {
        dispatch(loadingFinished('getConstants'));
        config.nethash = response.data.nethash;
        dispatch(peerSet(data, config));
        if (data.passphrase || data.hwInfo) {
          login(data, config)(dispatch, getState);
        }
      }).catch((error) => {
        dispatch(loadingFinished('getConstants'));
        dispatch(errorToastDisplayed({
          label: getConnectionErrorMessage(error),
        }));
      });
    } else {
      dispatch(peerSet(data, config));
      if (data.passphrase || data.hwInfo) {
        await login(data, config)(dispatch, getState);
      }
    }
  };


/**
 * Returns required action object to partially
 * update the active peer
 *
 * @param {Object} data - Active peer data
 * @returns {Object} Action object
 */
export const liskAPIClientUpdate = data => ({
  data,
  type: actionTypes.liskAPIClientUpdate,
});
