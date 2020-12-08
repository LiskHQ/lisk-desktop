import http from '../http';
import ws from '../ws';
import { isEmpty } from '../../helpers';
import { extractAddress } from '../../account';
import regex from '../../regex';

const httpPrefix = '/api/v1';

const httpPaths = {
  accounts: `${httpPrefix}/accounts`,
  account: `${httpPrefix}/account`,
};

const wsMethods = {
  accounts: 'get.accounts',
  account: 'get.accounts',
};

/**
 * Prioritizes the API params and if passed, converts
 * publicKey and passphrase to address.
 *
 * @param {Object} params
 * @param {String?} params.username Valid delegate username
 * @param {String?} params.address Valid Lisk Address
 * @param {String?} params.passphrase Valid Mnemonic passphrase
 * @param {String?} params.publicKey Valid Lisk PublicKey
 *
 * @returns {Object} Params containing either address or username
 */
const getAccountParams = (params) => {
  if (!params || isEmpty(params)) return {};
  // Pick username, cause the address is not obtainable from the username
  if (params.username) return { username: params.username };
  // If you have the address, you don't need anything else
  if (params.address) return { address: params.address };
  // convert other params to address
  if (params.publicKey || params.passphrase) {
    const address = extractAddress(params.publicKey || params.passphrase);
    return { address };
  }
  // if none of the above, ignore the params
  return {};
};

/**
 * Retrieves details of an account with given params
 *
 * @param {Object} data
 * @param {Object} data.network The network config from the Redux store
 * @param {String?} data.baseUrl Custom API URL
 * @param {Object} data.params
 * @param {String?} data.params.username Valid delegate username
 * @param {String?} data.params.address Valid Lisk Address
 * @param {String?} data.params.passphrase Valid Mnemonic passphrase
 * @param {String?} data.params.publicKey Valid Lisk PublicKey
 *
 * @returns {Promise}
 */
export const getAccount = async ({
  network, params, baseUrl,
}) => http({
  path: httpPaths.account,
  network,
  params: getAccountParams(params),
  baseUrl,
});

const txFilters = {
  limit: { key: 'limit', test: num => (typeof num === 'number') },
  offset: { key: 'offset', test: num => (typeof num === 'number' && num > 0) },
  sort: {
    key: 'sort',
    test: str => ['amount:asc', 'amount:desc', 'timestamp:asc', 'timestamp:desc'].includes(str),
  },
};

/**
 * Retrieves the list of accounts with given params
 *
 * @param {Object} data
 * @param {Object} data.network The network config from the Redux store
 * @param {String?} data.baseUrl Custom API URL
 * @param {Object} data.params
 * @param {String?} data.params.username Valid delegate username
 * @param {String?} data.params.address Valid Lisk Address
 * @param {String?} data.params.passphrase Valid Mnemonic passphrase
 * @param {String?} data.params.publicKey Valid Lisk PublicKey
 *
 * @returns {Promise}
 */
export const getAccounts = async ({
  network,
  params,
  baseUrl,
}) => {
  // Use websock to retrieve accounts with a given array of addresses
  if (Array.isArray(params.addressList) && params.addressList.length) {
    const requests = params.addressList
      .filter(address => regex.address.test(address))
      .map(address => ({
        method: wsMethods.accounts,
        params: { address },
      }));

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
    network,
    baseUrl,
    params: normParams,
  });
};
