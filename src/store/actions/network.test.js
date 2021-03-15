import actionTypes from 'constants';
import { networkSelected, networkConfigSet, networkStatusUpdated } from './network';
import { getNetworkConfig } from '../utils/api/network';

jest.mock('../utils/api/network', () => ({ getNetworkConfig: jest.fn() }));

describe('actions: network', () => {
  beforeEach(() => {
    jest.resetModules();
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
});
