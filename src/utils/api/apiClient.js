import { APIClient } from '@liskhq/lisk-client';

const networkNameMap = {
  mainnet: 'Mainnet',
  testnet: 'Testnet',
  betanet: 'Betanet',
};

// eslint-disable-next-line import/prefer-default-export
export const getApiClient = (networkName) => {
  if (networkName === networkNameMap.mainnet) {
    return APIClient.createMainnetAPIClient();
  } if (networkName === networkNameMap.testnet) {
    return APIClient.createMainnetAPIClient();
  } if (networkName === networkNameMap.betanet) {
    return APIClient.createMainnetAPIClient();
  }
  // custom node
  const client = new APIClient(['http://localhost:4000']);
  return client;
};
