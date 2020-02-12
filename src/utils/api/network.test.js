import Lisk from '@liskhq/lisk-client-old';

import { getAPIClient } from './network';
import networks from '../../constants/networks';
import { tokenMap } from '../../constants/tokens';

describe('Utils: network API', () => {
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

    it.skip('should create a new Lisk APIClient instance if called with LSK token', () => {
      const nethash = Lisk.APIClient.constants.MAINNET_NETHASH;
      const nodeUrl = 'https://hub23.lisk.io';
      const state = {
        network: {
          name: networks.customNode.name,
          networks: {
            [tokenMap.LSK.key]: {
              nethash,
              nodeUrl,
            },
          },
        },
      };
      getAPIClient(tokenMap.LSK.key, state);
      expect(constructorSpy).toHaveBeenCalledWith([nodeUrl], { nethash });
    });
  });
});
