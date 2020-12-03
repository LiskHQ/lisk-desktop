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

const moreThanOneDefinedParam = (params) => {
  let count = 0;
  return params.some((param) => {
    if (param) count++;
    if (count > 1) return true;
    return false;
  });
};
const removeUndefinedProps = (obj) => {
  Object.keys(obj).forEach((prop) => {
    if (obj[prop] === undefined) delete obj[prop];
  });
  return obj;
};

const errorTooManyParams = new Error('Request contains too many parameters');

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
 * @returns {Promise} http call or Promise rejection in case of validation error
 */
export const getDelegate = ({
  address, publicKey, username, network, baseUrl,
}) => new Promise(async (resolve, reject) => {
  const validateParams = { address, publicKey, username };
  if (moreThanOneDefinedParam(Object.values(validateParams))) {
    reject(errorTooManyParams);
  }

  try {
    const delegate = await http({
      path: ENDPOINTS.DELEGATES,
      params: removeUndefinedProps(validateParams),
      network,
      baseUrl,
    });
    resolve(delegate);
  } catch (e) {
    reject(e);
  }
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
 * @returns {Promise} http call or Promise rejection in case of validation error
 */
export const getDelegates = ({
  addressList, publicKeyList, usernameList,
  offset, limit, network, baseUrl,
// eslint-disable-next-line max-statements
}) => new Promise(async (resolve, reject) => {
  if (!addressList && !publicKeyList && !usernameList) {
    try {
      const delegates = await http({
        path: ENDPOINTS.DELEGATES,
        params: { offset, limit },
        network,
        baseUrl,
      });
      resolve(delegates);
    } catch (e) {
      reject(e);
    }
  } else {
    const validateParams = { addressList, publicKeyList, usernameList };
    if (moreThanOneDefinedParam(Object.values(validateParams))) {
      reject(errorTooManyParams);
    }
    try {
      const delegates = await ws({
        requests: {
          method: WS_METHODS.GET_DELEGATES,
          params: removeUndefinedProps(validateParams),
        },
        baseUrl,
      });
      resolve(delegates);
    } catch (e) {
      reject(e);
    }
  }
});

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
 * @returns {Promise} http call or Promise rejection in case of validation error
 */
export const getVotes = ({
  address, publicKey, network, baseUrl,
}) => new Promise(async (resolve, reject) => {
  const validateParams = { address, publicKey };
  if (moreThanOneDefinedParam(Object.values(validateParams))) {
    reject(errorTooManyParams);
  }

  try {
    const votes = await http({
      path: ENDPOINTS.VOTES_SENT,
      params: removeUndefinedProps(validateParams),
      network,
      baseUrl,
    });
    resolve(votes);
  } catch (e) {
    reject(e);
  }
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
 * @returns {Promise} http call or Promise rejection in case of validation error
 */
export const getVoters = ({
  address, publicKey, network, baseUrl,
}) => new Promise(async (resolve, reject) => {
  const validateParams = { address, publicKey };
  if (moreThanOneDefinedParam(Object.values(validateParams))) {
    reject(errorTooManyParams);
  }

  try {
    const voters = await http({
      path: ENDPOINTS.VOTES_RECEIVED,
      params: removeUndefinedProps(validateParams),
      network,
      baseUrl,
    });
    resolve(voters);
  } catch (e) {
    reject(e);
  }
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
 * @returns {Promise} http call or Promise rejection in case of validation error
 */
export const getForgers = ({
  limit, offset, network, baseUrl,
}) => http({
  path: ENDPOINTS.FORGERS,
  params: { offset, limit },
  network,
  baseUrl,
});
