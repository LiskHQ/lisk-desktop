import { APIClient } from '@liskhq/lisk-client';
import { networkKeys } from '../../constants/networks';

// eslint-disable-next-line import/prefer-default-export
export const getApiClient = (network) => {
  if (network.name === networkKeys.mainNet) {
    return APIClient.createMainnetAPIClient();
  }
  if (network.name === networkKeys.testNet) {
    return APIClient.createTestnetAPIClient();
  }

  const client = new APIClient([network.address]);
  return client;
};
