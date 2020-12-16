import { APIClient } from '@liskhq/lisk-client';
import networks from '../../constants/networks';

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
  const client = new APIClient([networks.customNode.address]);
  return client;
};
