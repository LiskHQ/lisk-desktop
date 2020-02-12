import Lisk from '@liskhq/lisk-client-old';

import networks from '../../../constants/networks';
import { getAPIClient } from './network';
import { tokenMap } from '../../../constants/tokens';

describe('Utils: network LSK API', () => {
  describe('getAPIClient', () => {
    let APIClientBackup;
    let constructorSpy;

    beforeEach(() => {
      constructorSpy = jest.fn();
      // TODO: find a better way of mocking Lisk.APIClient
      APIClientBackup = Lisk.APIClient;
      Lisk.APIClient = class MockAPIClient {
        constructor(...args) {
          constructorSpy(...args);
        }
      };
      Lisk.APIClient.constants = APIClientBackup.constants;
    });

    afterEach(() => {
      Lisk.APIClient = APIClientBackup;
    });

    it.skip('should create a new mainnet Lisk APIClient instance if network is mainnet', () => {
      const nethash = Lisk.APIClient.constants.MAINNET_NETHASH;
      const network = {
        name: networks.mainnet.name,
        networks: {
          [tokenMap.LSK.key]: {
          },
        },
      };
      const apiClient = getAPIClient(network);
      expect(constructorSpy).toHaveBeenCalledWith(networks.mainnet.nodes, { nethash });

      // should return the same object of called twice
      expect(apiClient).toEqual(getAPIClient(network));
    });

    it.skip('should create a new testnet Lisk APIClient instance if network is testnet', () => {
      const nethash = Lisk.APIClient.constants.TESTNET_NETHASH;
      const network = {
        name: networks.testnet.name,
        networks: {
          [tokenMap.LSK.key]: {
          },
        },
      };
      getAPIClient(network);
      expect(constructorSpy).toHaveBeenCalledWith(networks.testnet.nodes, { nethash });
    });

    it.skip('should create a new customNode Lisk APIClient instance if network is customNode', () => {
      const nethash = '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d';
      const nodeUrl = 'http://localhost:4000';
      const network = {
        name: networks.customNode.name,
        networks: {
          [tokenMap.LSK.key]: {
            nethash,
            nodeUrl,
          },
        },
      };
      getAPIClient(network);
      expect(constructorSpy).toHaveBeenCalledWith([nodeUrl], { nethash });
    });
  });
});
