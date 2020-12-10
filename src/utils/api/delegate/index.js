import http from '../http';
import ws from '../ws';
import { extractAddress } from '../../account';
import regex from '../../regex';

const httpPrefix = '/api/v1';

export const httpPaths = {
  delegates: `${httpPrefix}/delegates`,
  votesSent: `${httpPrefix}/votes_sent`,
  votesReceived: `${httpPrefix}/votes_received`,
  forgers: `${httpPrefix}/delegates/next_forgers`,
};

export const wsMethods = {
  delegates: 'get.delegates',
};

const getDelegateProps = ({ address, publicKey, username }) => {
  if (username) return { username };
  if (address) return { address };
  if (publicKey) return { address: extractAddress(publicKey) };
  return {};
};

/**
 * Retrieves data of a given delegate.
 *
 * @param {Object} data
 * @param {String?} data.address - Delegate address
 * @param {String?} data.publicKey - Delegate public key
 * @param {String?} data.username - Delegate username
 * @param {String?} data.baseUrl - Lisk Service API url to override the
 * existing ServiceUrl on the network param. We may use this to retrieve
 * the details of an archived transaction.
 * @param {Object} data.network - Network setting from Redux store
 * @returns {Promise} http call
 */
export const getDelegate = ({
  address, publicKey, username, network, baseUrl,
}) => http({
  path: httpPaths.delegates,
  params: getDelegateProps({ address, publicKey, username }),
  network,
  baseUrl,
});

const txFilters = {
  limit: { key: 'limit', test: num => (typeof num === 'number') },
  offset: { key: 'offset', test: num => (typeof num === 'number' && num > 0) },
  sort: {
    key: 'sort',
    test: str => [
      'rank:asc',
      'rank:desc',
      'productivity:asc',
      'productivity:desc',
      'missedBlocks:asc',
      'missedBlocks:desc',
    ].includes(str),
  },
};

const getRequests = (values) => {
  const paramList = values.find(item => Array.isArray(item.list) && item.list.length);
  if (paramList) {
    return paramList.list
      .filter(item => regex[paramList.name].test(item))
      .map(item => ({
        method: wsMethods.delegates,
        params: { [paramList.name]: item },
      }));
  }
  return false;
};

/**
 * Retrieves data of a list of delegates.
 *
 * @param {Object} data
 * @param {String?} data.addressList - Delegates address list
 * @param {String?} data.publicKeyList - Delegates public key list
 * @param {String?} data.usernameList - Delegates username list
 * @param {Number?} data.offset - Index of the first result
 * @param {Number?} data.limit - Maximum number of results
 * @param {String?} data.baseUrl - Lisk Service API url to override the
 * existing ServiceUrl on the network param. We may use this to retrieve
 * the details of an archived transaction.
 * @param {Object} data.network - Network setting from Redux store
 * @returns {Promise} http call or websocket call
 */
export const getDelegates = ({
  network,
  params = {},
  baseUrl,
}) => {
  // Use websocket to retrieve accounts with a given array of addresses
  const requests = getRequests([
    { name: 'address', list: params.addressList },
    { name: 'publicKey', list: params.publicKeyList },
    { name: 'username', list: params.usernameList },
  ]);
  if (requests) {
    return ws({
      network,
      requests,
    });
  }

  // Use HTTP to retrieve accounts with given sorting and pagination parameters
  const normParams = {};
  Object.keys(params).forEach((key) => {
    if (txFilters[key].test(params[key])) {
      normParams[txFilters[key].key] = params[key];
    }
  });

  return http({
    path: httpPaths.delegates,
    params: normParams,
    network,
    baseUrl,
  });
};

/**
 * Retrieves a list of votes sent by a given delegate.
 *
 * @param {Object} data
 * @param {String?} data.address - Delegate address
 * @param {String?} data.publicKey - Delegate public key
 * @param {String?} data.baseUrl - Lisk Service API url to override the
 * existing ServiceUrl on the network param. We may use this to retrieve
 * the details of an archived transaction.
 * @param {Object} data.network - Network setting from Redux store
 * @returns {Promise} http call
 */
export const getVotes = ({
  network,
  params = {},
  baseUrl,
}) => http({
  path: httpPaths.votesSent,
  params: getDelegateProps({ address: params.address, publicKey: params.publicKey }),
  network,
  baseUrl,
});

/**
 * Retrieves list of votes given for a given delegate.
 *
 * @param {Object} data
 * @param {String?} data.address - Delegate address
 * @param {String?} data.publicKey - Delegate public key
 * @param {Number?} data.offset - Index of the first result
 * @param {Number?} data.limit - Maximum number of results
 * @param {String?} data.baseUrl - Lisk Service API url to override the
 * existing ServiceUrl on the network param. We may use this to retrieve
 * the details of an archived transaction.
 * @param {Object} data.network - Network setting from Redux store
 * @returns {Promise} http call
 */
export const getVoters = ({
  network,
  params = {},
  baseUrl,
}) => {
  const pagination = {};
  Object.keys(params).forEach((key) => {
    if (txFilters[key].test(params[key])) {
      pagination[txFilters[key].key] = params[key];
    }
  });
  const account = getDelegateProps({
    address: params.address,
    publicKey: params.publicKey,
  });

  return http({
    path: httpPaths.votesReceived,
    params: {
      ...account,
      ...pagination,
    },
    network,
    baseUrl,
  });
};

/**
 * Retrieves list of active delegates.
 *
 * @param {Number?} data.offset - Index of the first result
 * @param {Number?} data.limit - Maximum number of results
 * @param {String?} data.baseUrl - Lisk Service API url to override the
 * existing ServiceUrl on the network param. We may use this to retrieve
 * the details of an archived transaction.
 * @param {Object} data.network - Network setting from Redux store
 * @returns {Promise} http call
 */
export const getForgers = ({
  network,
  params = {},
  baseUrl,
}) => http({
  path: httpPaths.forgers,
  params: { offset: params.offset, limit: params.limit },
  network,
  baseUrl,
});
