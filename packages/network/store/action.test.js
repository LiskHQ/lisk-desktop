import { actionTypes } from '@constants';
import { getNetworkConfig } from '@common/utilities/api/network';
import {
  networkSelected, networkConfigSet, networkStatusUpdated,
  customNetworkStored, customNetworkRemoved,
} from './network';
import { getState } from '../../../test/fixtures/transactions';

jest.mock('@common/utilities/api/network', () => ({
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
        moduleAssetId: '5:1',
        schema: state.network.networks.LSK.moduleAssetSchemas['5:1'],
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
