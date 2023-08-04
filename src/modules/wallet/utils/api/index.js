import { regex } from 'src/const/regex';
import { API_VERSION } from 'src/const/config';
import { HTTP_PREFIX } from 'src/const/httpCodes';
import http from 'src/utils/api/http';
import ws from 'src/utils/api/ws';
import client from 'src/utils/api/client';
import { extractAddressFromPublicKey } from '@wallet/utils/account';

const httpPaths = {
  account: `${HTTP_PREFIX}/auth`,
  accounts: `${HTTP_PREFIX}/auth`,
};

const wsMethods = {
  accounts: 'get.accounts',
  account: 'get.accounts',
};

const accountFilters = {
  limit: { key: 'limit', test: (num) => typeof num === 'number' },
  offset: { key: 'offset', test: (num) => typeof num === 'number' && num > 0 },
  sort: {
    key: 'sort',
    test: (str) => ['balance:asc', 'balance:desc'].includes(str),
  },
};

const getRequests = (values, isValidator) => {
  const paramList = values.find((item) => Array.isArray(item.list) && item.list.length);
  if (paramList) {
    return paramList.list
      .filter((item) => regex[paramList.name].test(item))
      .map((item) => {
        const params = isValidator
          ? {
              [paramList.name]: item,
              isValidator: true,
            }
          : {
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
      transformResponse: (response) => {
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

export const getAccounts = async ({ network, params = {}, baseUrl }) => {
  // Use websocket to retrieve accounts with a given array of addresses
  const requests = getRequests(
    [
      { name: 'address', list: params.addressList },
      { name: 'publicKey', list: params.publicKeyList },
      { name: 'username', list: params.usernameList },
    ],
    params.isValidator
  );
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
