import http from '../http';
import ws from '../ws';
import { getAccount, getAccounts } from './lsk';
import accounts from '../../../../test/constants/accounts';

jest.mock('../http', () => jest.fn().mockReturnValue([]));
jest.mock('../ws', () => jest.fn().mockReturnValue([]));

describe('API: LSK Account', () => {
  const network = { serviceUrl: 'http://sample.com/' };

  beforeEach(() => jest.clearAllMocks());

  describe('getAccounts', () => {
    it('should return a list of accounts without params', async () => {
      const response = await getAccounts({ network });

      expect(response).toBeDefined();
      expect(http).toHaveBeenCalledTimes(1);
      expect(ws).not.toHaveBeenCalled();
    });

    it('should call ws with addressList if it is provided', async () => {
      const expectedApiCallParams = [
        { method: 'get.accounts', params: { address: '12L' } },
        { method: 'get.accounts', params: { address: '13L' } },
      ];
      const response = await getAccounts({
        network,
        params: {
          addressList: ['12L', '13L'],
        },
      });

      expect(response).toBeDefined();
      expect(ws).toHaveBeenCalledWith(
        expect.objectContaining({ requests: expectedApiCallParams }),
      );
      expect(http).not.toHaveBeenCalled();
    });

    it('should call http with given filters', async () => {
      const params = {
        limit: 10,
        offset: 10,
      };
      const response = await getAccounts({
        network,
        params,
      });

      expect(response).toBeDefined();
      expect(http).toHaveBeenCalledWith({ network, params });
      expect(ws).not.toHaveBeenCalled();
    });

    it('should call http with given filters', async () => {
      const params = {
        limit: 10,
        offset: 10,
      };
      const response = await getAccounts({
        network,
        params,
      });

      expect(response).toBeDefined();
      expect(http).toHaveBeenCalledWith({ network, params });
      expect(ws).not.toHaveBeenCalled();
    });
  });

  describe('getAccount', () => {
    const {
      address,
      username,
      publicKey,
      passphrase,
    } = accounts.delegate;

    it('should call http with right params, prioritizing 1. username', async () => {
      await getAccount({
        network,
        params: {
          address,
          username,
          publicKey,
          passphrase,
        },
      });

      expect(http).toHaveBeenCalledWith({
        network,
        params: { username },
        baseUrl: undefined,
        path: '/api/v1/account',
      });
    });

    it('should call http with right params, prioritizing 2. address', async () => {
      await getAccount({
        network,
        params: {
          address,
          publicKey,
          passphrase,
        },
      });

      expect(http).toHaveBeenCalledWith({
        network,
        params: { address },
        baseUrl: undefined,
        path: '/api/v1/account',
      });
    });

    it('should call http with right address, if publicKey passed', async () => {
      await getAccount({
        network,
        params: {
          publicKey,
        },
      });

      expect(http).toHaveBeenCalledWith({
        network,
        params: { address },
        baseUrl: undefined,
        path: '/api/v1/account',
      });
    });

    it('should call http with right address, if passphrase passed', async () => {
      await getAccount({
        network,
        params: {
          passphrase,
        },
      });

      expect(http).toHaveBeenCalledWith({
        network,
        params: { address },
        baseUrl: undefined,
        path: '/api/v1/account',
      });
    });
  });
});
