import http from '../http';
import ws from '../ws';

const httpPrefix = '/api/v1';

const httpPaths = {
  accounts: `${httpPrefix}/accounts`,
  account: `${httpPrefix}/account`,
};

const wsMethods = {
  accounts: 'get.accounts',
  account: 'get.accounts',
};


// eslint-disable-next-line import/prefer-default-export
export const getAccount = async ({
  network, address, publicKey, username, passphrase,
}) => {
  const selectParams = (params) => {
    const selectedParams = {};
    if (address) {
      selectedParams.address = params.address;
    } else if (publicKey) {
      selectedParams.publicKey = params.publicKey;
    } else if (username) {
      selectedParams.username = params.username;
    } else if (passphrase) {
      // @@todo add a unit test that checks that fetch is never called with the passphrase
      // getAddressFromPassphrase...
      selectedParams.address = '';
    }

    return selectedParams;
  };

  const params = selectParams({
    address, passphrase, publicKey, username,
  });

  const path = httpPaths.account;
  const response = await http({ path, network, params });
  // @todo handle errors?
  return response;
};

export const getAccounts = async ({
  network, addressList, offset, limit, top,
}) => {
  const selectParams = (params) => {
    const selectedParams = {};
    if (addressList) {
      selectedParams.addressList = params.addressList;
    } else {
      selectedParams.offset = params.offset;
      selectedParams.limit = params.limit;
      selectedParams.top = params.top;
    }

    return selectedParams;
  };

  const params = selectParams({
    addressList, offset, limit, top,
  });

  const protocol = params.addressList ? 'ws' : 'http';

  if (protocol === 'http') {
    const path = httpPaths.accounts;
    const response = await http({ path, network, params });
    // @todo handle errors?
    return response;
  }

  const response = await ws({
    baseUrl: network.serviceUrl,
    requests: [{ method: wsMethods.accounts, params }],
  });
  // @todo handle errors?
  return response;
};
