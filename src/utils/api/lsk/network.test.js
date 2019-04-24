import Lisk from 'lisk-elements';

import { expect } from 'chai';
import { mock } from 'sinon';
import { getLiskAPIClient } from './network';
import { tokenMap } from '../../../constants/tokens';

describe('Utils: network API', () => {
  describe('getLiskAPIClient', () => {
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
      const address = 'https://hub23.lisk.io';
      const state = {
        network: {
          [tokenMap.LSK.key]: {
            nethash,
            address,
          },
        },
      };
      getLiskAPIClient(state);
      expect(constructorSpy).to.have.been.calledWith([address], { nethash });
    });
  });
});
