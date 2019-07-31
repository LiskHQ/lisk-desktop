import { constants } from '@liskhq/lisk-client';
import networks from '../constants/networks';
import getNetwork, { getNetworkIdentifier } from './getNetwork';

describe('getNetwork Utils', () => {
  const { MAINNET_NETHASH, TESTNET_NETHASH } = constants;
  describe('getNetwork function', () => {
    it('Should return correct network Object', () => {
      let expectedNetwork = networks.mainnet;
      expect(getNetwork('Mainnet')).toEqual(expectedNetwork);

      expectedNetwork = networks.testnet;
      expect(getNetwork('Testnet')).toEqual(expectedNetwork);

      expectedNetwork = networks.customNode;
      expect(getNetwork('Custom Node')).toEqual(expectedNetwork);
    });
  });

  describe('getNetworkIdentifier function', () => {
    it('Should return network name based on nethash', () => {
      let network = {
        name: 'Mainnet',
        networks: {
          LSK: { nethash: MAINNET_NETHASH },
        },
      };
      expect(getNetworkIdentifier(network)).toBe('mainnet');

      network = {
        name: 'Testnet',
        networks: {
          LSK: { nethash: TESTNET_NETHASH },
        },
      };
      expect(getNetworkIdentifier(network)).toBe('testnet');
    });

    it('Should return network name based on name', () => {
      let network = {
        name: 'Mainnet',
        networks: {
          LSK: { nethash: MAINNET_NETHASH },
        },
      };
      expect(getNetworkIdentifier(network)).toBe('mainnet');

      network = {
        name: 'Testnet',
        networks: {
          LSK: { nethash: TESTNET_NETHASH },
        },
      };
      expect(getNetworkIdentifier(network)).toBe('testnet');
    });

    it('Should return nethash for custom node', () => {
      const network = {
        name: 'Custom Node',
        networks: {
          LSK: { nethash: '098f6bcd4621d373cade4e832627b4f6' },
        },
      };
      expect(getNetworkIdentifier(network)).toBe(network.networks.LSK.nethash);
    });
  });
});
