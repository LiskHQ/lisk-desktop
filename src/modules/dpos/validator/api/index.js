import { regex } from 'src/const/regex';
import http from '@common/utilities/api/http';
import ws, { subscribe, unsubscribe } from '@common/utilities/api/ws';
import { extractAddressFromPublicKey } from '@wallet/utils/account';

const httpPrefix = '/api/v2';

export const httpPaths = {
  delegates: `${httpPrefix}/accounts`,
  votesSent: `${httpPrefix}/votes_sent`,
  votesReceived: `${httpPrefix}/votes_received`,
  forgers: `${httpPrefix}/forgers`,
};

export const wsMethods = {
  delegates: 'get.accounts',
  forgers: 'get.delegates.next_forgers',
  forgersRound: 'update.round',
};

const getDelegateProps = ({ address, publicKey, username }) => {
  if (username) return { username };
  if (address) return { address };
  if (publicKey) return { address: extractAddressFromPublicKey(publicKey) };
  return {};
};

/**
 * Retrieves data of a given delegate.
 *
 * @param {Object} data
 * @param {String?} data.params.address - Delegate address
 * @param {String?} data.params.publicKey - Delegate public key
 * @param {String?} data.params.username - Delegate username
 * @param {String?} data.baseUrl - Lisk Service API url to override the
 * existing ServiceUrl on the network param. We may use this to retrieve
 * the details of an archived transaction.
 * @param {Object} data.network - Network setting from Redux store
 * @returns {Promise} http call
 */
export const getDelegate = ({
  params = {}, network, baseUrl,
}) => http({
  path: httpPaths.delegates,
  params: { ...getDelegateProps(params), isDelegate: true },
  network,
  baseUrl,
});

const txFilters = {
  limit: { key: 'limit', test: num => (typeof num === 'number') },
  offset: { key: 'offset', test: num => (typeof num === 'number' && num > 0) },
  search: { key: 'search', test: str => (typeof str === 'string' && str.length > 0) },
  status: { key: 'status', test: str => (typeof str === 'string' && str.length > 0) },
  aggregate: { key: 'aggregate', test: value => typeof value === 'boolean' },
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
        params: { [paramList.name]: item, isDelegate: true },
      }));
  }
  return false;
};

/**
 * Retrieves data of a list of delegates.
 *
 * @param {Object} data
 * @param {String?} data.params.addressList - Delegates address list
 * @param {String?} data.params.publicKeyList - Delegates public key list
 * @param {String?} data.params.usernameList - Delegates username list
 * @param {String?} data.params.search - A string to search for usernames
 * @param {Number?} data.params.offset - Index of the first result
 * @param {Number?} data.params.limit - Maximum number of results
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
      requests,
      baseUrl: baseUrl || network.serviceUrl,
    });
  }

  // Use HTTP to retrieve accounts with given sorting and pagination parameters
  const normParams = { isDelegate: true };
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
 * Retrieves a list of votes sent by a given account
 *
 * @param {Object} data
 * @param {String?} data.params.address - account address
 * @param {String?} data.params.publicKey - account public key
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
 * @param {String?} data.params.address - Delegate address
 * @param {String?} data.params.publicKey - Delegate public key
 * @param {Number?} data.params.offset - Index of the first result
 * @param {Number?} data.params.limit - Maximum number of results
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
    if (txFilters[key] && txFilters[key].test(params[key])) {
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
 * @param {Number?} data.params.offset - Index of the first result
 * @param {Number?} data.params.limit - Maximum number of results
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
  params,
  network,
  baseUrl,
});

/**
 * Connects to block change event via websocket and set function to be called when it fires
 *
 * @param {Object} network - Redux network state
 * @param {Function} callback - Function to be called when event fires
 * @param {Function} onDisconnect - Function to be called when disconnect event fires
 * @param {Function} onReconnect - Function to be called when reconnect event fires
 */
export const forgersSubscribe = (network, callback, onDisconnect, onReconnect) => {
  const node = network?.networks?.LSK?.serviceUrl;
  if (node) {
    subscribe(
      `${node}/blockchain`, wsMethods.forgersRound, callback, onDisconnect, onReconnect,
    );
  }
};

/**
 * Disconnects from block change websocket event and deletes socket connection
 *
 * @param {Object} network - Redux network state
 */
export const forgersUnsubscribe = () => {
  unsubscribe(wsMethods.forgersRound);
};
