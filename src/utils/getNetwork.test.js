import {
  getNetworksList,
  getNetworkName,
  getConnectionErrorMessage,
} from './getNetwork';

describe('Utils: getNetwork', () => {
  describe('getNetworksList', () => {
    const response = [
      { label: 'Mainnet', name: 'mainnet' },
      { label: 'Testnet', name: 'testnet' },
      { label: 'Custom Service Node', name: 'customNode' },
    ];
    it('returns names and labels', () => {
      expect(getNetworksList()).toEqual(response);
    });
  });

  describe.skip('getNetworkName', () => {
    it('should discover mainnet', () => {
      const network = {
        name: 'customNode',
      };
      expect(getNetworkName(network, 'LSK')).toEqual('mainnet');
    });

    it('should discover testnet', () => {
      const network = {
        name: 'customNode',
      };
      expect(getNetworkName(network, 'LSK')).toEqual('testnet');
    });

    it('should mark as customNode otherwise', () => {
      const network = {
        name: 'customNode',
        networks: {
          LSK: {
            nethash: 'sample_hash',
          },
        },
      };
      expect(getNetworkName(network, 'LSK')).toEqual('customNode');
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
