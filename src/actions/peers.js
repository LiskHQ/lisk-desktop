import i18next from 'i18next';
import Lisk from 'lisk-elements';
import actionTypes from '../constants/actions';
import networks from '../constants/networks';
import { errorToastDisplayed } from './toaster';
import { loadingStarted, loadingFinished } from '../actions/loading';

import { getAccount } from '../utils/api/account';
import { extractAddress, extractPublicKey } from '../utils/account';
import { accountLoggedIn, accountLoading, accountLoggedOut } from './account';
import accountConfig from '../constants/account';
import settings from '../constants/settings';

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

const login = (dispatch, getState, data, config) => {
  if (data.passphrase || data.hwInfo) {
    const store = getState();
    const { lockDuration } = accountConfig;
    const { passphrase } = data;
    const { code } = data.network;
    const publicKey = passphrase ? extractPublicKey(passphrase) : data.publicKey;
    const liskAPIClient = store.peers.liskAPIClient ||
      new Lisk.APIClient(config.nodes, { nethash: config.nethash });
    const address = extractAddress(publicKey);
    const accountBasics = {
      passphrase,
      publicKey,
      address,
      network: code || 0,
      peerAddress: data.network.nodes[0],
    };

    dispatch(accountLoading());

    // redirect to main/transactions
    getAccount(liskAPIClient, address).then((accountData) => {
      const duration = (passphrase && store.settings.autoLog) ?
        Date.now() + lockDuration : 0;
      const accountUpdated = {
        ...accountData,
        ...accountBasics,
        expireTime: duration,
      };
      /* Save selected network to localStorage */
      const networkAddress = data.network.address ? data.network.address : data.network.nodes[0];
      window.localStorage.setItem(settings.keys.liskCoreUrl, networkAddress);

      dispatch(accountLoggedIn(accountUpdated));
    }).catch((error) => {
      if (error && error.message) {
        dispatch(errorToastDisplayed({ label: i18next.t(`Unable to connect to the node, Error: ${error.message}`) }));
      } else {
        dispatch(errorToastDisplayed({ label: i18next.t('Unable to connect to the node, no response from the server.') }));
      }
      dispatch(accountLoggedOut());
    });
  }
};

/**
 * Returns required action object to set
 * the given peer data as active peer
 * This should be called once in login page
 *
 * @param {Object} data - Active peer data and the passphrase of account
 * @returns {Object} Action object
 */
export const liskAPIClientSet = data =>
  (dispatch, getState) => {
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
        login(dispatch, getState, data, config);
      }).catch((error) => {
        dispatch(loadingFinished('getConstants'));
        if (error && error.message) {
          dispatch(errorToastDisplayed({ label: i18next.t(`Unable to connect to the node, Error: ${error.message}`) }));
        } else {
          dispatch(errorToastDisplayed({ label: i18next.t('Unable to connect to the node, no response from the server.') }));
        }
      });
    } else {
      dispatch(peerSet(data, config));
      login(dispatch, getState, data, config);
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
