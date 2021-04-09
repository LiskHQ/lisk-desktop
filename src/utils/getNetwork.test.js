import { constants } from '@liskhq/lisk-client';
import {
  getNetworksList,
  getNetworkNameBasedOnNethash,
  getConnectionErrorMessage,
} from './getNetwork';

describe('Utils: getNetwork', () => {
  // const { MAINNET_NETHASH, TESTNET_NETHASH } = constants;

  describe.skip('getNetworksList', () => {
    const response = [
      { label: 'Mainnet', name: 'mainnet' },
      { label: 'Testnet', name: 'testnet' },
      { label: 'Custom Node', name: 'customNode' },
    ];
    it('returns names and labels', () => {
      expect(getNetworksList()).toEqual(response);
    });
  });

  describe.skip('getNetworkNameBasedOnNethash', () => {
    it('should discover mainnet', () => {
      const network = {
        name: 'customNode',
        networks: {
          // LSK: {
          //   nethash: MAINNET_NETHASH,
          // },
        },
      };
      expect(getNetworkNameBasedOnNethash(network, 'LSK')).toEqual('mainnet');
    });

    it('should discover testnet', () => {
      const network = {
        name: 'customNode',
        networks: {
          // LSK: {
          //   nethash: TESTNET_NETHASH,
          // },
        },
      };
      expect(getNetworkNameBasedOnNethash(network, 'LSK')).toEqual('testnet');
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
      expect(getNetworkNameBasedOnNethash(network, 'LSK')).toEqual('customNode');
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
