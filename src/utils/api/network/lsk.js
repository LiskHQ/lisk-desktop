import { networks, networkKeys } from '@constants';
import http from '../http';

const httpPrefix = '/api/v2';

const httpPaths = {
  peers: `${httpPrefix}/peers/connected`,
  networkStatus: `${httpPrefix}/network/status`,
  networkStatistics: `${httpPrefix}/network/statistics`,
};

/**
 * Retrieves status information of the network
 *
 * @param {Object} data
 * @param {Object} data.network The network config from the Redux store
 *
 * @returns {Promise}
 */
export const getNetworkStatus = ({
  baseUrl,
}) => http({
  baseUrl,
  path: httpPaths.networkStatus,
});

const getServiceUrl = ({ name, address = 'http://localhost:4000' }) => {
  if ([networkKeys.mainNet, networkKeys.testNet].includes(name)) {
    return networks[name].serviceUrl;
  }
  if (name === networkKeys.customNode) {
    const serviceUrl = window.localStorage.getItem('serviceUrl');
    if (serviceUrl) {
      return serviceUrl;
    }
    return address.replace(/:\d{2,4}/, ':9901');
  }
  throw Error('The node url entered does not have a corresponding service url');
};

/**
 * Returns network config to use for future API calls.
 *
 * @param {Object} network
 * @param {String} network.name - Mainnet, or Testnet, Custom node
 * @param {String} network.nodeUrl - a valid URL pointing to a running node
 * @returns {Promise}
 */
export const getNetworkConfig = ({ name, address }) => {
  const serviceUrl = getServiceUrl({ name, address });
  return getNetworkStatus({ baseUrl: serviceUrl })
    .then(response => ({
      ...response.data,
      serviceUrl,
    }))
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
      throw Error(`Can not connect to ${address}`);
    });
};

/**
 * Retrieves status useful statistics about the network
 *
 * @param {Object} data
 * @param {Object} data.network The network config from the Redux store
 *
 * @returns {Promise}
 */
export const getNetworkStatistics = ({
  network,
}) => http({
  path: httpPaths.networkStatistics,
  network,
});

const peerFilters = {
  version: { key: 'version', test: str => (typeof str === 'string') },
  height: { key: 'height', test: num => (typeof num === 'number' && num > 0) },
  limit: { key: 'limit', test: num => (typeof num === 'number') },
  offset: { key: 'offset', test: num => (typeof num === 'number' && num > 0) },
  sort: {
    key: 'sort',
    test: str => ['height:asc', 'height:desc', 'version:asc', 'version:desc'].includes(str),
  },
};

/**
 * Retrieves list of connected peers which
 * are discoverable by Lisk Service
 *
 * @param {Object} data
 * @param {Object} data.network The network config from the Redux store
 * @param {String?} data.baseUrl Custom API URL
 * @param {Object} data.params
 * @param {String?} data.params.version Lisk Core version number which the node rus
 * @param {String?} data.params.height Block height at which the node runs
 * @param {String?} data.params.offset Used for pagination
 * @param {String?} data.params.sort  an option of 'version:asc', 'version:desc',
 * 'height:asc' and 'height:desc'
 *
 * @returns {Promise}
 */
export const getConnectedPeers = ({
  network,
  params,
}) => {
  const normParams = {};
  Object.keys(params).forEach((key) => {
    if (peerFilters[key].test(params[key])) {
      normParams[peerFilters[key].key] = params[key];
    } else {
      // eslint-disable-next-line no-console
      console.log(`getConnectedPeers: Dropped ${key} parameter, it's invalid.`);
    }
  });

  return http({
    path: httpPaths.peers,
    network,
    params,
  });
};
