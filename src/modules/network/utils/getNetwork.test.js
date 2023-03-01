import {
  getNetworksList,
  getNetworkName,
  getConnectionErrorMessage,
} from './getNetwork';

describe('Utils: getNetwork', () => {
  describe('getNetworksList', () => {
    const response = [
      { label: 'Mainnet', name: 'mainnet' },
      { label: 'Alphanet', name: 'alphanet' },
      { label: 'Betanet', name: 'betanet' },
      { label: 'Devnet', name: 'devnet' },
      { label: 'Testnet', name: 'testnet' },
      { label: 'Custom Service Node', name: 'customNode' },
    ];

    it('returns names and labels', () => {
      expect(getNetworksList()).toEqual(response);
    });
  });

  describe('getNetworkName', () => {
    it('should return alphanet if network config does not have name set', () => {
      const network = {};
      expect(getNetworkName(network)).toEqual('devnet');
    });

    it('should return customNode', () => {
      const network = {
        name: 'customNode',
      };
      expect(getNetworkName(network)).toEqual(network.name);
    });

    it('should return testnet', () => {
      const network = {
        name: 'testnet',
      };
      expect(getNetworkName(network)).toEqual(network.name);
    });

    it('should return mainnet', () => {
      const network = {
        name: 'mainnet',
      };
      expect(getNetworkName(network)).toEqual(network.name);
    });
  });

  describe('getConnectionErrorMessage', () => {
    it('should display the error message if presented', () => {
      expect(getConnectionErrorMessage({
        message: 'sample error message',
      })).toEqual('Unable to connect to the node, Error: sample error message');
    });
  });
});
