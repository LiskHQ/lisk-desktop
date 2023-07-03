import client from 'src/utils/api/client';
import { HTTP_PREFIX } from 'src/const/httpCodes';
import { extractAddressFromPublicKey } from '@wallet/utils/account';

export const httpPaths = {
  validators: `${HTTP_PREFIX}/accounts`,
  stakes: `${HTTP_PREFIX}/pos/stakes`,
  stakers: `${HTTP_PREFIX}/pos/stakers`,
  generators: `${HTTP_PREFIX}/generators`,
};

export const wsMethods = {
  validators: 'get.accounts',
  generators: 'get.validators.next_generators',
  generatorsRound: 'update.round',
};

const getValidatorProps = ({ address, publicKey, username }) => {
  if (username) return { username };
  if (address) return { address };
  if (publicKey) return { address: extractAddressFromPublicKey(publicKey) };
  return {};
};

const txFilters = {
  limit: { key: 'limit', test: (num) => typeof num === 'number' },
  offset: { key: 'offset', test: (num) => typeof num === 'number' && num > 0 },
  search: { key: 'search', test: (str) => typeof str === 'string' && str.length > 0 },
  status: { key: 'status', test: (str) => typeof str === 'string' && str.length > 0 },
  aggregate: { key: 'aggregate', test: (value) => typeof value === 'boolean' },
  sort: {
    key: 'sort',
    test: (str) =>
      [
        'rank:asc',
        'rank:desc',
        'productivity:asc',
        'productivity:desc',
        'missedBlocks:asc',
        'missedBlocks:desc',
      ].includes(str),
  },
};

/**
 * Retrieves a list of stakes sent by a given account
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
export const getStakes = ({ params = {} }) =>
  client.rest({
    url: httpPaths.stakes,
    params: getValidatorProps({ address: params.address, publicKey: params.publicKey }),
  });

// @TODO: we need to refactor this function when service has made modifications to this endpoint
/**
 * Retrieves validators by address
 *
 * @param {Object} data
 * @param {String?} data.params.addresses - account addresses
 * @param {String?} data.baseUrl - Lisk Service API url to override the
 * existing ServiceUrl on the network param. We may use this to retrieve
 * the details of an archived transaction.
 * @param {Object} data.network - Network setting from Redux store
 * @returns {Promise} http call
 */
export const getValidatorList = ({ params = {} }) =>
  client.rest({
    url: httpPaths.validators,
    params: { addresses: params.addresses.join(',') },
  });

/**
 * Retrieves list of stakers given for a given validator.
 *
 * @param {Object} data
 * @param {String?} data.params.address - Validator address
 * @param {String?} data.params.publicKey - Validator public key
 * @param {Number?} data.params.offset - Index of the first result
 * @param {Number?} data.params.limit - Maximum number of results
 * @param {String?} data.baseUrl - Lisk Service API url to override the
 * existing ServiceUrl on the network param. We may use this to retrieve
 * the details of an archived transaction.
 * @param {Object} data.network - Network setting from Redux store
 * @returns {Promise} http call
 */
export const getStakers = ({ network, params = {}, baseUrl }) => {
  const pagination = {};
  Object.keys(params).forEach((key) => {
    if (txFilters[key] && txFilters[key].test(params[key])) {
      pagination[txFilters[key].key] = params[key];
    }
  });
  const account = getValidatorProps({
    address: params.address,
    publicKey: params.publicKey,
  });

  return client.rest({
    url: httpPaths.stakers,
    params: {
      ...account,
      ...pagination,
    },
    network,
    baseUrl,
  });
};
