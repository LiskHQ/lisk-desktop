import { getDuplicateNetworkFields } from './index';

describe('getDuplicateNetworkFields', () => {
  const MAINNET = {
    name: 'Mainnet',
    serviceUrl: 'https://mainnet-service.lisk.com',
    wsServiceUrl: 'wss://mainnet-service.lisk.com',
  };

  const CUSTOM = {
    name: 'Custom',
    serviceUrl: 'https://custom-service.lisk.com',
    wsServiceUrl: 'wss://custom-service.lisk.com',
  };

  const MOCK_NETWORKS = [MAINNET, CUSTOM];

  it('Should return undefined if no duplicate values', () => {
    const UNIQUE_NETWORK = {
      name: 'New',
      serviceUrl: 'https://new-service.lisk.com',
      wsServiceUrl: 'wss://new-service.lisk.com',
    };

    expect(getDuplicateNetworkFields(UNIQUE_NETWORK, MOCK_NETWORKS)).toBeUndefined();
  });

  it('Should return the duplicate fields', () => {
    expect(getDuplicateNetworkFields(MAINNET, MOCK_NETWORKS)).toEqual(MAINNET);
  });

  it('Should ignore excluded network even if it is a duplicate', () => {
    expect(getDuplicateNetworkFields(MAINNET, MOCK_NETWORKS, MAINNET.name)).toBeUndefined();
  });

  it('Should return the duplicate fields from whole array', () => {
    const newNetwork = {
      name: MAINNET.name,
      serviceUrl: CUSTOM.serviceUrl,
    };

    expect(getDuplicateNetworkFields(newNetwork, MOCK_NETWORKS)).toEqual(newNetwork);
  });

  it('Should return a single field if a duplicate', () => {
    const newNetwork = {
      name: MAINNET.name,
    };

    expect(getDuplicateNetworkFields(newNetwork, MOCK_NETWORKS)).toEqual(newNetwork);
  });
});
