import { cryptography } from '@liskhq/lisk-client';
import { HTTP_CODES } from 'src/const/httpCodes';
import http from 'src/utils/api/http';
import ws from 'src/utils/api/ws';
import accounts from '@tests/constants/wallets';
import { getAccount, getAccounts } from './index';

jest.mock('src/utils/api/http', () => jest.fn().mockReturnValue([]));
jest.mock('src/utils/api/ws', () => jest.fn().mockReturnValue([]));
jest
  .spyOn(cryptography.address, 'getLisk32AddressFromPublicKey')
  .mockReturnValue(accounts.validator.summary.address);

describe('API: LSK Account', () => {
  const network = {
    networks: {
      LSK: { serviceUrl: 'http://sample.com/' },
    },
  };
  const baseUrl = 'http://custom-basse-url.com/';
  const path = '/api/v3/auth';

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
        {
          method: 'get.accounts',
          params: { address: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y99' },
          jsonrpc: '2.0',
        },
        {
          method: 'get.accounts',
          params: { address: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y91' },
          jsonrpc: '2.0',
        },
      ];
      // BaseUrl is not used for WS calls
      const response = await getAccounts({
        network,
        params: {
          addressList: [
            'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y99',
            'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y91',
          ],
        },
        path: 'transactions',
      });

      expect(response).toBeDefined();
      expect(ws).toHaveBeenCalledWith(expect.objectContaining({ requests: expectedApiCallParams }));
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
        network,
        params,
        baseUrl,
        path,
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
        network,
        params,
        baseUrl: undefined,
        path,
      });
      expect(ws).not.toHaveBeenCalled();
    });
  });

  describe('getAccount', () => {
    const {
      summary: { address, publicKey, privateKey },
      pos: {
        validator: { username },
      },
      passphrase,
    } = accounts.validator;

    it('should call http with right params, prioritizing 1. username', async () => {
      http.mockImplementation(() => Promise.resolve({ data: [{ summary: { publicKey } }] }));
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
      http.mockImplementation(() => Promise.resolve({ data: [{ summary: { publicKey } }] }));
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
        params: { publicKey },
        baseUrl: undefined,
        path,
      });
    });

    it('should call http with right address, if publicKey passed', async () => {
      http.mockImplementation(() => Promise.resolve({ data: [{ summary: { publicKey } }] }));
      // Checks with no baseUrl
      await getAccount({
        network,
        params: {
          publicKey,
        },
      });

      expect(http).toHaveBeenCalledWith({
        network,
        params: { publicKey },
        baseUrl: undefined,
        path,
      });
    });

    it('should call http without base url if not passed', async () => {
      http.mockImplementation(() => Promise.resolve({ data: [{ summary: { publicKey } }] }));
      // Checks with no baseUrl
      await getAccount({
        network,
        params: { passphrase },
      });

      expect(http).toHaveBeenCalledWith({
        network,
        params: { publicKey },
        baseUrl: undefined,
        path,
      });
    });

    it('should call http with right address, if passphrase passed', async () => {
      http.mockImplementation(() => Promise.resolve({ data: [{ summary: { publicKey } }] }));
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
        params: { publicKey },
        baseUrl,
        path,
      });
    });

    it('should return an account if the API returns 404', async () => {
      const error = Error('Account not found.');
      error.code = HTTP_CODES.NOT_FOUND;
      http.mockImplementation(() => Promise.reject(error));
      // Checks the baseUrl too
      const result = await getAccount({
        network,
        params: {
          publicKey,
          privateKey,
        },
        baseUrl,
      });

      expect(result).toEqual({
        summary: {
          address,
          balance: 0,
          token: 'LSK',
          publicKey,
          privateKey,
        },
        sequence: {
          nonce: 0,
        },
      });
    });

    it('should use the public key from params if the account is uninitialized', async () => {
      http.mockImplementation(() =>
        Promise.resolve({
          data: {
            summary: {
              publicKey,
              address,
              balance: 0,
              token: 'LSK',
            },
          },
        })
      );
      // Checks the baseUrl too
      const result = await getAccount({
        network,
        params: { publicKey },
        baseUrl,
      });

      expect(result).toEqual({
        keys: {
          summary: {
            address,
            balance: 0,
            token: 'LSK',
            publicKey,
          },
        },
        publicKey: '',
      });
    });

    it('should use extract the public key from params.passphrase if the account is uninitialized', async () => {
      http.mockImplementation(() =>
        Promise.resolve({
          data: {
            summary: {
              publicKey,
              privateKey,
              address,
              balance: 0,
              token: 'LSK',
            },
          },
        })
      );
      // Checks the baseUrl too
      const result = await getAccount({
        network,
        params: {
          privateKey,
          publicKey,
        },
        baseUrl,
      });

      expect(result).toEqual({
        keys: {
          summary: {
            address,
            balance: 0,
            token: 'LSK',
            publicKey,
            privateKey,
          },
        },
        publicKey: '',
      });
    });
  });
});
