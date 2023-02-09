import { regex } from 'src/const/regex';
import { tokenMap } from '@token/fungible/consts/tokens';
import { API_VERSION } from 'src/const/config';
import { HTTP_CODES, HTTP_PREFIX } from 'src/const/httpCodes';
import http from 'src/utils/api/http';
import ws from 'src/utils/api/ws';
import client from 'src/utils/api/client';
import { isEmpty } from 'src/utils/helpers';
import { extractAddressFromPublicKey, extractPublicKey } from '@wallet/utils/account';

const httpPaths = {
  account: `${HTTP_PREFIX}/auth`,
  accounts: `${HTTP_PREFIX}/auth`,
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
 * @param {String?} params.username Valid validator username
 * @param {String?} params.address Valid Lisk Address
 * @param {String?} params.passphrase Valid Mnemonic passphrase
 * @param {String?} params.publicKey Valid Lisk PublicKey
 *
 * @returns {Object} Params containing either address or username
 */
const getAccountParams = async (params) => {
  if (!params || isEmpty(params)) return {};
  const {
    username,
    address,
    passphrase,
    publicKey,
  } = params;

  if (username) return { username };
  if (publicKey) return { publicKey };
  if (address) return { address };
  if (passphrase) {
    return { publicKey: await extractPublicKey(passphrase) };
  }

  return {};
};

/**
 * Retrieves details of an account with given params
 *
 * @param {Object} data
 * @param {Object} data.network The network config from the Redux store
 * @param {String?} data.baseUrl Custom API URL
 * @param {Object} data.params
 * @param {String?} data.params.username Valid validator username
 * @param {String?} data.params.address Valid Lisk Address
 * @param {String?} data.params.passphrase Valid Mnemonic passphrase
 * @param {String?} data.params.publicKey Valid Lisk PublicKey
 *
 * @returns {Promise}
 */
// eslint-disable-next-line complexity, max-statements
export const getAccount = async ({
  network, params, baseUrl,
}) => {
  const normParams = await getAccountParams(params);

  try {
    const response = await http({
      baseUrl,
      path: httpPaths.account,
      network,
      params: normParams,
    });

    if (response.data) {
      const account = {
        keys: { ...response.data },
        publicKey: response.meta?.publicKey ?? '',
      };
      return account;
    }
  } catch (e) {
    if (e.code === HTTP_CODES.NOT_FOUND) {
      // eslint-disable-next-line no-console
      console.log('Lisk account not found.');

      if (params.publicKey) {
        const address = extractAddressFromPublicKey(params.publicKey);
        const account = {
          summary: {
            publicKey: params.publicKey,
            privateKey: params.privateKey,
            balance: 0,
            address,
            token: tokenMap.LSK.key,
          },
          sequence: {
            nonce: 0,
          },
        };
        return account;
      }
    } else {
      throw Error(e);
    }
  }
  throw Error('Error retrieving account');
};

const accountFilters = {
  limit: { key: 'limit', test: num => (typeof num === 'number') },
  offset: { key: 'offset', test: num => (typeof num === 'number' && num > 0) },
  sort: {
    key: 'sort',
    test: str => ['balance:asc', 'balance:desc'].includes(str),
  },
};

const getRequests = (values, isValidator) => {
  const paramList = values.find(item => Array.isArray(item.list) && item.list.length);
  if (paramList) {
    return paramList.list
      .filter(item => regex[paramList.name].test(item))
      .map((item) => {
        const params = isValidator
          ? {
            [paramList.name]: item,
            isValidator: true,
          } : {
            [paramList.name]: item,
          };
        return {
          method: wsMethods.accounts,
          params,
          jsonrpc: '2.0',
        };
      });
  }
  return false;
};

export const getUsedHWAccounts = async (publicKeyList) => {
  const config = {
    url: `/api/${API_VERSION}/tokens`,
    method: 'get',
    event: 'get.tokens',
  };

  const requests = publicKeyList.map((publicKey) => {
    const address = extractAddressFromPublicKey(publicKey);
    const requestConfig = {
      ...config,
      transformResponse: response => {
        const res = JSON.parse(response);
        return res.data?.length
        ? {
          ...res.data[0],
          address,
          publicKey,
        }
        : {
          address,
          publicKey,
          availableBalance: 0,
        };
      },
      params: {
        limit: 1,
        address,
      },
    };

    return client.call(requestConfig);
  });

  return Promise.all(requests);
};

/**
 * Retrieves the list of accounts with given params
 *
 * @param {Object} data
 * @param {Object} data.network The network config from the Redux store
 * @param {String?} data.baseUrl Custom API URL
 * @param {Object} data.params
 * @param {String?} data.params.usernameList Valid validator username
 * @param {String?} data.params.addressList Valid Lisk Address
 * @param {String?} data.params.publicKeyList Valid Lisk PublicKey
 * @param {String?} data.params.limit Used for pagination
 * @param {String?} data.params.offset Used for pagination
 * @param {String?} data.params.sort  an option of 'balance:asc' and 'balance:desc',
 *
 * @returns {Promise}
 */
export const getAccounts = async ({
  network,
  params = {},
  baseUrl,
}) => {
  // Use websocket to retrieve accounts with a given array of addresses
  const requests = getRequests([
    { name: 'address', list: params.addressList },
    { name: 'publicKey', list: params.publicKeyList },
    { name: 'username', list: params.usernameList },
  ], params.isValidator);
  if (requests.length) {
    return ws({
      requests,
      baseUrl: baseUrl || network.networks.LSK.serviceUrl,
    });
  }

  // Use HTTP to retrieve accounts with given sorting and pagination parameters
  const normParams = {};
  Object.keys(params).forEach((key) => {
    if (accountFilters[key] && accountFilters[key].test(params[key])) {
      normParams[accountFilters[key].key] = params[key];
    }
  });

  return http({
    path: httpPaths.accounts,
    network,
    baseUrl,
    params: normParams,
  });
};
