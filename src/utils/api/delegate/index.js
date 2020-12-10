import http from '../http';
import ws from '../ws';

export const ENDPOINTS = {
  DELEGATES: '/api/v1/delegates',
  VOTES_SENT: '/api/v1/votes_sent',
  VOTES_RECEIVED: '/api/v1/votes_received',
  FORGERS: '/api/v1/delegates/next_forgers',
};

export const WS_METHODS = {
  GET_DELEGATES: 'get.delegates',
};

const removeUndefinedProps = (obj) => {
  Object.keys(obj).forEach((prop) => {
    if (obj[prop] === undefined) delete obj[prop];
  });
  return obj;
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
  path: ENDPOINTS.DELEGATES,
  params: removeUndefinedProps({ address, publicKey, username }),
  network,
  baseUrl,
});

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
  addressList, publicKeyList, usernameList,
  offset, limit, network, baseUrl,
}) => {
  if (!addressList && !publicKeyList && !usernameList) {
    return http({
      path: ENDPOINTS.DELEGATES,
      params: { offset, limit },
      network,
      baseUrl,
    });
  }
  return ws({
    requests: {
      method: WS_METHODS.GET_DELEGATES,
      params: removeUndefinedProps({ addressList, publicKeyList, usernameList }),
    },
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
  address, publicKey, network, baseUrl,
}) => http({
  path: ENDPOINTS.VOTES_SENT,
  params: removeUndefinedProps({ address, publicKey }),
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
  address, publicKey, network, baseUrl, limit, offset,
}) => http({
  path: ENDPOINTS.VOTES_RECEIVED,
  params: { ...removeUndefinedProps({ address, publicKey }), limit, offset },
  network,
  baseUrl,
});

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
  limit, offset, network, baseUrl,
}) => http({
  path: ENDPOINTS.FORGERS,
  params: { offset, limit },
  network,
  baseUrl,
});
