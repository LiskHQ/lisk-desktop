import { getNetworkConfig } from 'src/modules/network/utils/api';
import { getState } from '@fixtures/transactions';
import actionTypes from './actionTypes';
import {
  networkSelected, networkConfigSet, networkStatusUpdated,
  customNetworkStored, customNetworkRemoved,
} from './action';

jest.mock('@network/utils/api', () => ({
  getNetworkConfig:
    jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          data: [],
          meta: { total: 0 },
        }),
        ok: true,
      })),
}));

const state = getState();

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      data: [{
        moduleCommand: 'pos:stake',
        schema: state.network.networks.LSK.moduleCommandSchemas['pos:stake'],
      }],
      meta: { total: 0 },
    }),
    ok: true,
  }));

describe('actions: network', () => {
  beforeEach(() => {
    jest.resetModules();
    fetch.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('networkSelected', () => {
    it('should create networkSelected action', () => {
      const data = { name: '' };
      const action = networkSelected(data);
      expect(action).toMatchObject({ type: actionTypes.networkSelected, data });
    });
  });

  describe('networkStatusUpdated', () => {
    it('should create networkStatusUpdated action ', () => {
      const online = false;
      const action = networkStatusUpdated({ online });
      expect(action).toMatchObject({
        type: actionTypes.networkStatusUpdated,
        data: { online },
      });
    });
  });

  describe('networkConfigSet', () => {
    it('should create networkConfigSet action ', async () => {
      const data = { name: 'example', address: 'http://example.com' };
      const action = await networkConfigSet(data);
      expect(action).toMatchObject({
        type: actionTypes.networkConfigSet,
      });
      expect(action.data).toMatchObject({ name: data.name, networks: expect.anything() });
      expect(getNetworkConfig).toHaveBeenCalled();
    });
  });

  describe('customNetworkStored', () => {
    it('should create customNetworkStored action', () => {
      const data = 'http:example.com';
      const action = customNetworkStored(data);
      expect(action).toMatchObject({ type: actionTypes.customNetworkStored, data });
    });
  });

  describe('customNetworkRemoved', () => {
    it('should create customNetworkRemoved action', () => {
      const action = customNetworkRemoved();
      expect(action).toMatchObject({ type: actionTypes.customNetworkRemoved });
    });
  });
});
