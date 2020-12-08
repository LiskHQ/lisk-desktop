import http from '../http';
import ws from '../ws';
import { getAccount, getAccounts } from './lsk';

jest.mock('../http', () => jest.fn().mockReturnValue([]));
jest.mock('../ws', () => jest.fn().mockReturnValue([]));

describe('API: LSK Account', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getAccounts', () => {
    it('should return a list of accounts', async () => {
      const response = await getAccounts({
        network: { serviceUrl: 'http://example.com' },
      });

      expect(response).toBeDefined();
      expect(http).toHaveBeenCalledTimes(1);
      expect(ws).not.toHaveBeenCalled();
    });

    it('should call ws with addressList if it is provided', async () => {
      const expectedApiCallParams = [{ method: 'get.accounts', params: { addressList: [] } }];
      const response = await getAccounts({
        network: { serviceUrl: '' },
        addressList: [],
        offset: 10,
        limit: 20,
      });

      expect(response).toBeDefined();
      expect(ws).toHaveBeenCalledWith(
        expect.objectContaining({ requests: expectedApiCallParams }),
      );
      expect(ws).toHaveBeenCalledWith(
        expect.not.objectContaining({ offset: 10, limit: 20 }),
      );
      expect(http).not.toHaveBeenCalled();
    });
  });

  describe('getAccount', () => {
    it('should return one account', async () => {
      const response = await getAccount({
        network: { serviceUrl: 'http://example.com' },
      });

      expect(response).toBeDefined();
      expect(http).toHaveBeenCalledTimes(1);
      expect(ws).not.toHaveBeenCalled();
    });
  });
});
