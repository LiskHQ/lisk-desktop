import http from 'src/utils/api/http';
import { HTTP_PREFIX } from 'src/const/httpCodes';

const httpPaths = {
  peers: `${HTTP_PREFIX}/network/peers`,
  networkStatistics: `${HTTP_PREFIX}/network/statistics`,
};

/**
 * Retrieves status useful statistics about the network
 *
 * @param {Object} data
 * @param {Object} data.network The network config from the Redux store
 *
 * @returns {Promise}
 */
export const getNetworkStatistics = ({ network }) =>
  http({
    path: httpPaths.networkStatistics,
    network,
  });

const peerFilters = {
  version: { key: 'version', test: (str) => typeof str === 'string' },
  state: { key: 'state', test: (str) => typeof str === 'string' },
  height: { key: 'height', test: (num) => typeof num === 'number' && num > 0 },
  limit: { key: 'limit', test: (num) => typeof num === 'number' },
  offset: { key: 'offset', test: (num) => typeof num === 'number' && num > 0 },
  sort: {
    key: 'sort',
    test: (str) => ['height:asc', 'height:desc', 'version:asc', 'version:desc'].includes(str),
  },
};

/**
 * Retrieves list of peers which
 * are discoverable by Lisk Service
 */
export const getPeers = ({ network, params }) => {
  const normParams = {};
  Object.keys(params).forEach((key) => {
    if (peerFilters[key].test(params[key])) {
      normParams[peerFilters[key].key] = params[key];
    } else {
      // eslint-disable-next-line no-console
      console.log(`getPeers: Dropped ${key} parameter, it's invalid.`);
    }
  });

  return http({
    path: httpPaths.peers,
    network,
    params,
  });
};
