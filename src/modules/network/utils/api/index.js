import networks, { networkKeys } from '@network/configuration/networks';
import http from 'src/utils/api/http';
import { HTTP_PREFIX } from 'src/const/httpCodes';

const httpPaths = {
  peers: `${HTTP_PREFIX}/network/peers`,
  networkStatus: `${HTTP_PREFIX}/network/status`,
  networkStatistics: `${HTTP_PREFIX}/network/statistics`,
};

export const getNetworkStatus = ({ baseUrl }) =>
  http({
    baseUrl,
    path: httpPaths.networkStatus,
  });

const getServiceUrl = ({ name, address = networks[networkKeys.mainnet].serviceUrl }) => {
  if ([networkKeys.mainnet, networkKeys.testnet].includes(name)) {
    return networks[name].serviceUrl;
  }
  return address;
};

export const getNetworkConfig = async ({ name, address }) => {
  const serviceUrl = getServiceUrl({ name, address });
  try {
    const response = await getNetworkStatus({ baseUrl: serviceUrl });
    return {
      ...response.data,
      serviceUrl,
    };
  } catch (err) {
    return err;
  }
};

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
