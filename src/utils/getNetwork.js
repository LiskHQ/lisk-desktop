import Lisk from '@liskhq/lisk-client';
import i18next from 'i18next';
import networks, { networkKeys } from '../constants/networks';
import { tokenMap } from '../constants/tokens';

export const getNetworksList = () =>
  Object.values(networkKeys)
    .map(name => ({
      label: i18next.t(networks[name].label),
      name,
    }));


export const getNetworkNameBasedOnNethash = (network, token = 'LSK') => {
  const isCustomNode = network.name === networkKeys.customNode;
  const isBtc = token === tokenMap.BTC.key;

  if (isCustomNode && !isBtc) {
    const { nethash } = network.networks[token];
    const testNet = nethash === Lisk.constants.TESTNET_NETHASH ? 'testNet' : '';
    const mainNet = nethash === Lisk.constants.MAINNET_NETHASH ? 'mainNet' : '';
    return networkKeys[mainNet || testNet] || network.name;
  }

  if (isCustomNode && isBtc) {
    return networkKeys.testNet;
  }
  return network.name;
};

/**
 * Returns human readable error messages
 *
 * @param {Object} error
 * @param {String} error.message - The error message received from network API call
 * @returns {String} - The human readable error message.
 */
export const getConnectionErrorMessage = error => (
  error && error.message
    ? i18next.t(`Unable to connect to the node, Error: ${error.message}`)
    : i18next.t('Unable to connect to the node, no response from the server.')
);
