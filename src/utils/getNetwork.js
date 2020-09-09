import Lisk from '@liskhq/lisk-client';
import i18next from 'i18next';
import networks from '../constants/networks';

const getNetwork = (networkName) => {
  let network;
  Object.keys(networks).forEach((key) => {
    if (networks[key].name === networkName) {
      network = networks[key];
    }
  });
  return network;
};

export default getNetwork;

/**
 * If Mainnet or Testnet returns the name, if custom node returns the nethash
 * @param {Object} network - network object from store, with options.code or options.nethash set.
 */
export const getNetworkIdentifier = (network) => {
  const networkName = network.name;
  const selectedNetwork = (Lisk.constants.MAINNET_NETHASH === network.networks.LSK.nethash
    && networks.mainnet)
    || (Lisk.constants.TESTNET_NETHASH === network.networks.LSK.nethash && networks.testnet)
    || getNetwork(networkName);
  return !selectedNetwork.custom
    ? selectedNetwork.name.toLowerCase()
    : network.networks.LSK.nethash;
};

export const getNetworksList = () =>
  Object.keys(networks)
    .filter(network => network !== 'default')
    .map((network, index) => ({
      label: i18next.t(networks[network].name),
      name: networks[network].name,
      value: index,
    }));


export const getNetworkNameBasedOnNethash = (network, token = 'LSK') => {
  let activeNetwork = network.name;
  if (network.name === networks.customNode.name && token !== 'BTC') {
    activeNetwork = network.networks[token].nethash === Lisk.constants.TESTNET_NETHASH
      ? networks.testnet.name
      : network.name;
  }

  if (network.name === networks.customNode.name && token === 'BTC') {
    activeNetwork = networks.testnet.name;
  }
  return activeNetwork;
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
