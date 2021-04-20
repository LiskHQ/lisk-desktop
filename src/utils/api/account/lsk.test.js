import http from '../http';
import ws from '../ws';
import { getAccount, getAccounts } from './lsk';
import accounts from '../../../../test/constants/accounts';

jest.mock('../http', () => jest.fn().mockReturnValue([]));
jest.mock('../ws', () => jest.fn().mockReturnValue([]));

describe('API: LSK Account', () => {
  const network = {
    networks: {
      LSK: { serviceUrl: 'http://sample.com/' },
    },
  };
  const baseUrl = 'http://custom-basse-url.com/';
  const path = '/api/v2/accounts';

  beforeEach(() => jest.clearAllMocks());

  describe('getAccounts', () => {
    it('should return a list of accounts without params', async () => {
      // Checks with no baseUrl
      const response = await getAccounts({ network });

      expect(response).toBeDefined();
      expect(http).toHaveBeenCalledTimes(1);
      expect(ws).not.toHaveBeenCalled();
    });

    it('should call ws with addressList if it is provided', async () => {
      const expectedApiCallParams = [
        { method: 'get.accounts', params: { address: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y99' }, jsonrpc: '2.0' },
        { method: 'get.accounts', params: { address: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y91' }, jsonrpc: '2.0' },
      ];
      // BaseUrl is not used for WS calls
      const response = await getAccounts({
        network,
        params: {
          addressList: ['lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y99', 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y91'],
        },
        path: 'transactions',
      });

      expect(response).toBeDefined();
      expect(ws).toHaveBeenCalledWith(
        expect.objectContaining({ requests: expectedApiCallParams }),
      );
      expect(http).not.toHaveBeenCalled();
    });

    it('should call http with given filters and baseUrl', async () => {
      const params = {
        limit: 10,
        offset: 10,
        sort: 'balance:desc',
      };
      // Checks the baseUrl too
      const response = await getAccounts({
        network,
        params,
        baseUrl,
      });

      expect(response).toBeDefined();
      expect(http).toHaveBeenCalledWith({
        network, params, baseUrl, path,
      });
      expect(ws).not.toHaveBeenCalled();
    });

    it('should call http with given filters', async () => {
      const params = {
        limit: 10,
        offset: 10,
      };
      // Checks with no baseUrl
      const response = await getAccounts({
        network,
        params,
      });

      expect(response).toBeDefined();
      expect(http).toHaveBeenCalledWith({
        network, params, baseUrl: undefined, path,
      });
      expect(ws).not.toHaveBeenCalled();
    });
  });

  describe('getAccount', () => {
    const {
      summary: { address, publicKey },
      dpos: { delegate: { username } },
      passphrase,
    } = accounts.delegate;

    it('should call http with right params, prioritizing 1. username', async () => {
      http.mockImplementation(() => Promise.resolve({ data: [{}] }));
      // Checks the baseUrl too
      await getAccount({
        network,
        baseUrl,
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
        baseUrl,
        path,
      });
    });

    it('should call http with right params, prioritizing 2. address', async () => {
      http.mockImplementation(() => Promise.resolve({ data: [{}] }));
      // Checks with no baseUrl
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
        path,
      });
    });

    it('should call http with right address, if publicKey passed', async () => {
      http.mockImplementation(() => Promise.resolve({ data: [{}] }));
      // Checks with no baseUrl
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
        path,
      });
    });

    it('should call http without base url if not passed', async () => {
      http.mockImplementation(() => Promise.resolve({ data: [{}] }));
      // Checks with no baseUrl
      await getAccount({
        network,
        params: { passphrase },
      });

      expect(http).toHaveBeenCalledWith({
        network,
        params: { address },
        baseUrl: undefined,
        path,
      });
    });

    it('should call http with right address, if passphrase passed', async () => {
      http.mockImplementation(() => Promise.resolve({ data: [{}] }));
      // Checks the baseUrl too
      await getAccount({
        network,
        params: {
          passphrase,
        },
        baseUrl,
      });

      expect(http).toHaveBeenCalledWith({
        network,
        params: { address },
        baseUrl,
        path,
      });
    });

    it('should return an account if the API returns 404', async () => {
      http.mockImplementation(() => Promise.reject(Error('Account not found.')));
      // Checks the baseUrl too
      const result = await getAccount({
        network,
        params: {
          passphrase,
        },
        baseUrl,
      });

      expect(result).toEqual({
        summary: {
          address,
          balance: 0,
          token: 'LSK',
          publicKey,
        },
      });
    });
  });
});
