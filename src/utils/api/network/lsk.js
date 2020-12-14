import Lisk from '@liskhq/lisk-client';

import networks from '../../../constants/networks';
import { camelize } from '../../helpers';

export const getServerUrl = (nodeUrl, nethash) => {
  if (nethash === Lisk.constants.MAINNET_NETHASH) {
    return 'https://mainnet-service.lisk.io';
  }
  if (nethash === Lisk.constants.TESTNET_NETHASH) {
    return 'https://testnet-service.lisk.io';
  }
  if (/localhost|liskdev.net:\d{2,4}$/.test(nodeUrl)) {
    return nodeUrl.replace(/:\d{2,4}/, ':9901');
  }
  if (/\.(liskdev.net|lisk.io)$/.test(nodeUrl)) {
    return nodeUrl.replace(/\.(liskdev.net|lisk.io)$/, $1 => `-service${$1}`);
  }
  return 'unavailable';
};

/**
 * Returns network config to use for future API calls.
 *
 * @param {Object} network
 * @param {String} network.name - Mainnet, or Testnet, Custom node
 * @param {String} network.nodeUrl - a valid URL pointing to a running node
 * @returns {Promise}
 */
export const getNetworkConfig = (network) => {
  const networkConfig = networks[camelize(network.name)];
  if (networkConfig.name === networks.customNode.name) {
    networkConfig.nodes = [network.address];
  }

  // get mainnet testnet node url here
  return new Lisk.APIClient([networkConfig.nodes[0]], {}).node.getConstants()
    .then(response => ({
      ...networkConfig,
      nodeUrl: networkConfig.nodes[0],
      custom: networkConfig.name === networks.customNode.name,
      code: networkConfig.code,
      nethash: response.data.nethash,
      networkIdentifier: response.data.networkId,
    }));
};

export const getConnectedPeers = data => new Promise(resolve =>
  resolve({ endpoint: 'getConnectedPeers', token: 'LSK', data }));

export const getNetworkStatus = data => new Promise(resolve =>
  resolve({ endpoint: 'getNetworkStatus', token: 'LSK', data }));

export const getNetworkStatistics = data => new Promise(resolve =>
  resolve({ endpoint: 'getNetworkStatistics', token: 'LSK', data }));
