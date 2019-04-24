import { networkSet, networkStatusUpdated } from './index';
import networks from '../../constants/networks';
import { tokenMap } from '../../constants/tokens';
import actionTypes from '../../constants/actions';

describe('actions: network', () => {
  let dispatch;

  beforeEach(() => {
    jest.resetModules();
    dispatch = jest.fn();
  });

  describe('networkSet', () => {
    it('should create networkSet action with name and token', () => {
      const { name } = networks.testnet;
      networkSet({ name })(dispatch);
      expect(dispatch).toHaveBeenNthCalledWith(1, {
        data: {
          name,
          token: tokenMap.BTC.key,
          network: {},
        },
        type: actionTypes.networkSet,
      });
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
