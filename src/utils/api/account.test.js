import { getAccount } from './account';
import * as lskAccountApi from './lsk/account';
import networks from '../../constants/networks';

jest.mock('./lsk/account');

describe('Utils: Account API', () => {
  const address = '123L';
  const networkConfig = {
    name: networks.mainnet.name,
    networks: {
      LSK: {},
    },
  };

  describe('getAccount', () => {
    it('should resolve getAccount for specific token (BTC, LSK, ...) based on the address format ', async () => {
      const params = {
        address,
        networkConfig,
      };
      await getAccount(params);
      expect(lskAccountApi.getAccount).toHaveBeenCalledWith(expect.objectContaining({
        networkConfig,
        address,
      }));
    });
  });
});

