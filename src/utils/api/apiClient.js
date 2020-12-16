import { APIClient } from '@liskhq/lisk-client';
import networks from '../../constants/networks';

// eslint-disable-next-line import/prefer-default-export
export const getApiClient = (networkName) => {
  if (networkName === networks.mainnet.name) {
    return APIClient.createMainnetAPIClient();
  }
  if (networkName === networks.testnet.name) {
    return APIClient.createMainnetAPIClient();
  }

  // the networks object does not contain any betanet info
  // if (networkName === networks.betanet.name) {
  //   return APIClient.createMainnetAPIClient();
  // }

  // custom node
  const client = new APIClient([networks.customNode.address]);
  return client;
};
