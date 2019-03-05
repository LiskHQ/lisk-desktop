import { constants } from 'lisk-elements';
import networks from '../constants/networks';
import getNetwork, { getNetworkIdentifier } from './getNetwork';

describe('getNetwork Utils', () => {
  describe('getNetwork function', () => {
    it('Should return correct network Object', () => {
      let expectedNetwork = networks.mainnet;
      expect(getNetwork(0)).toEqual(expectedNetwork);

      expectedNetwork = networks.testnet;
      expect(getNetwork(1)).toEqual(expectedNetwork);

      expectedNetwork = networks.customNode;
      expect(getNetwork(2)).toEqual(expectedNetwork);
    });
  });

  describe('getNetworkIdentifier function', () => {
    it('Should return network name based on nethash', () => {
      const { MAINNET_NETHASH, TESTNET_NETHASH } = constants;
      let peers = { options: { nethash: MAINNET_NETHASH } };
      expect(getNetworkIdentifier(peers)).toBe('mainnet');

      peers = { options: { nethash: TESTNET_NETHASH } };
      expect(getNetworkIdentifier(peers)).toBe('testnet');
    });

    it('Should return network name based on code', () => {
      let peers = { options: { code: 0 } };
      expect(getNetworkIdentifier(peers)).toBe('mainnet');

      peers = { options: { code: 1 } };
      expect(getNetworkIdentifier(peers)).toBe('testnet');
    });

    it('Should return nethash for custom node', () => {
      const peers = { options: { code: 2, nethash: '098f6bcd4621d373cade4e832627b4f6' } };
      expect(getNetworkIdentifier(peers)).toBe(peers.options.nethash);
    });
  });
});
