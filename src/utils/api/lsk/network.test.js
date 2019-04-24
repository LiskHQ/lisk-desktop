import Lisk from 'lisk-elements';
import { expect } from 'chai';
import { mock } from 'sinon';

import networks from '../../../constants/networks';
import { getApiClient } from './network';
import { tokenMap } from '../../../constants/tokens';

describe('Utils: network LSK API', () => {
  describe('getApiClient', () => {
    let APIClientBackup;
    let constructorSpy;

    beforeEach(() => {
      constructorSpy = mock();
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

    it('should create a new Lisk APIClient instance', () => {
      const nethash = Lisk.APIClient.constants.MAINNET_NETHASH;
      const state = {
        network: {
          [tokenMap.LSK.key]: {
          },
        },
      };
      getApiClient(state);
      expect(constructorSpy).to.have.been.calledWith(networks.mainnet.nodes, { nethash });
    });
  });
});
