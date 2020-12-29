import Lisk from '@liskhq/lisk-client';

import networks from '../../../constants/networks';
import { camelize } from '../../helpers';
import { getApiClient } from '../apiClient';

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
    networkConfig.nodes = [network.network.address];
  }
  const nodeUrl = networkConfig.nodes[0];

  const apiClient = getApiClient(network);
  return apiClient.node.getConstants()
    .then((response) => {
      const nethash = response.data.nethash;

      return ({
        ...networkConfig,
        nodeUrl,
        nethash,
        serviceUrl: getServerUrl(nodeUrl, nethash),
        custom: networkConfig.name === networks.customNode.name,
        code: networkConfig.code,
        networkIdentifier: response.data.networkId,
      });
    });
};

export const getConnectedPeers = data => new Promise(resolve =>
  resolve({ endpoint: 'getConnectedPeers', token: 'LSK', data }));

export const getNetworkStatus = data => new Promise(resolve =>
  resolve({ endpoint: 'getNetworkStatus', token: 'LSK', data }));

export const getNetworkStatistics = data => new Promise(resolve =>
  resolve({ endpoint: 'getNetworkStatistics', token: 'LSK', data }));
