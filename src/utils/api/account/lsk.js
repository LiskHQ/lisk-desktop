import http from '../http';
import ws from '../ws';

const DEFAULT_PROTOCOL = 'ws';
const httpPrefix = '/api/v1';

const httpPaths = {
  accounts: `${httpPrefix}/accounts}`,
  account: `${httpPrefix}/account}`,
};

const wsMethods = {
  accounts: 'get.accounts',
  account: 'get.accounts',
};

const selectParams = ({
  address, username, publicKey, passphrase,
}) => {
  const selectedParams = {};
  if (address) {
    selectedParams.address = address;
  } else if (publicKey) {
    selectedParams.publicKey = publicKey;
  } else if (username) {
    selectedParams.username = username;
  } else if (passphrase) {
    // @@todo add a unit test that checks that fetch is never called with the passphrase
    // getAddressFromPassphrase...
    selectedParams.address = '';
  }

  return selectedParams;
};

// eslint-disable-next-line import/prefer-default-export
export const getAccount = async ({
  protocol = DEFAULT_PROTOCOL, network, address, publicKey, username, passphrase,
}) => {
  const path = httpPaths.account;
  const method = 'GET';
  const params = selectParams({
    address, passphrase, publicKey, username,
  });

  if (protocol === 'http') {
    const response = await http({
      path, network, method, params,
    });
    // @todo handle errors?
    return response;
  }

  const response = await ws({
    baseUrl: 'some url',
    requests: [{ method: wsMethods.account, params }],
  });
  // @todo handle errors?
  return response;
};
