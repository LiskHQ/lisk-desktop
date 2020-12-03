import http from '../http';
import ws from '../ws';

const areAllParametersUndefined = params => !params.some(param => param);
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

const errorNoParams = new Error('No parameter passed');
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
}) => {
  const validateParams = [address, publicKey, username];
  if (areAllParametersUndefined(validateParams)) return Promise.reject(errorNoParams);
  if (moreThanOneDefinedParam(validateParams)) return Promise.reject(errorTooManyParams);
  return http({
    path: '/api/v1/delegate',
    params: removeUndefinedProps(validateParams),
    network,
    baseUrl,
  });
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
 * @returns {Promise} http call or Promise rejection in case of validation error
 */
export const getDelegates = ({
  addressList, publicKeyList, usernameList,
  offset, limit, network, baseUrl,
}) => {
  const validateParams = [addressList, publicKeyList, usernameList];
  if (areAllParametersUndefined(validateParams)) {
    return http({
      path: '/api/v1/delegates',
      params: { offset, limit },
      network,
      baseUrl,
    });
  }
  if (moreThanOneDefinedParam(validateParams)) return Promise.reject(errorTooManyParams);
  return ws({
    requests: {
      rethod: 'get.delegates',
      params: removeUndefinedProps(validateParams),
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
 * @returns {Promise} http call or Promise rejection in case of validation error
 */
export const getVotes = ({
  address, publicKey, network, baseUrl,
}) => {
  const validateParams = [address, publicKey];
  if (areAllParametersUndefined(validateParams)) return Promise.reject(errorNoParams);
  if (moreThanOneDefinedParam(validateParams)) return Promise.reject(errorTooManyParams);
  return http({
    path: '/api/v1/votes_sent',
    params: removeUndefinedProps(validateParams),
    network,
    baseUrl,
  });
};

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
}) => {
  const validateParams = [address, publicKey];
  if (areAllParametersUndefined(validateParams)) return Promise.reject(errorNoParams);
  if (moreThanOneDefinedParam(validateParams)) return Promise.reject(errorTooManyParams);
  return http({
    path: '/api/v1/votes_received',
    params: removeUndefinedProps(validateParams),
    network,
    baseUrl,
  });
};

export const getForgers = ({
  limit, offset, network, baseUrl,
}) => http({
  path: '/api/v1/delegates/next_forgers',
  params: { offset, limit },
  network,
  baseUrl,
});
