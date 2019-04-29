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
    it('should create networkSet action with name and token', async () => {
      const { name } = networks.testnet;
      await networkSet({ name })(dispatch);
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
        data: {
          name,
          token: tokenMap.LSK.key,
        },
        type: actionTypes.networkSet,
      }));
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
