import { networkSet, networkStatusUpdated } from './index';
import * as lskNetworkActions from './lsk';
import networks from '../../constants/networks';

describe('actions: network', () => {
  let dispatch;

  beforeEach(() => {
    jest.resetModules();
    dispatch = jest.fn();
    jest.spyOn(lskNetworkActions, 'networkSet');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('networkSet', () => {
    it('should call lsk networkSet action', async () => {
      const { name } = networks.testnet;
      networkSet({ name })(dispatch);
      expect(lskNetworkActions.networkSet).toHaveBeenCalled();
    });
  });

  describe('networkStatusUpdated', () => {
    it('should create networkStatusUpdated action ', () => {
      const online = false;
      expect(networkStatusUpdated({ online })).toMatchObject({
        data: { online },
      });
    });
  });
});
