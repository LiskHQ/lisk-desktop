import { networkSet } from './btc';
import networks from '../../constants/networks';
import { tokenMap } from '../../constants/tokens';

describe('actions: network.btc', () => {
  describe('networkSet', () => {
    it('should create networkSet action with code and token', () => {
      const { code } = networks.testnet;
      expect(networkSet({ code })).toMatchObject({
        data: {
          code,
          token: tokenMap.BTC.key,
        },
      });
    });
  });
});
