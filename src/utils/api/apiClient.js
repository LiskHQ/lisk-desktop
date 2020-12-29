import { APIClient } from '@liskhq/lisk-client';
import networks from '../../constants/networks';

// eslint-disable-next-line import/prefer-default-export
export const getApiClient = (network) => {
  if (network.name === networks.mainnet.name) {
    return APIClient.createMainnetAPIClient();
  }
  if (network.name === networks.testnet.name) {
    return APIClient.createTestnetAPIClient();
  }

  const client = new APIClient([network.network.address]);
  return client;
};
