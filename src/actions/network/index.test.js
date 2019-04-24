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
    it('should create networkSet action with code and token', () => {
      const { code } = networks.testnet;
      networkSet({ code })(dispatch);
      expect(dispatch).toHaveBeenNthCalledWith(1, {
        data: {
          code,
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
