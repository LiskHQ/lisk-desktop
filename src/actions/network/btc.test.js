import { networkSet } from './btc';
import networks from '../../constants/networks';
import { tokenMap } from '../../constants/tokens';

describe('actions: network.btc', () => {
  describe('networkSet', () => {
    it('should create networkSet action with name and token', () => {
      const { name } = networks.testnet;
      expect(networkSet({ name })).toMatchObject({
        data: {
          name,
          token: tokenMap.BTC.key,
        },
      });
    });
  });
});
