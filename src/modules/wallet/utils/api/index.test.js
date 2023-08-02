import http from 'src/utils/api/http';
import ws from 'src/utils/api/ws';
import { getAccounts } from './index';

jest.mock('src/utils/api/http', () => jest.fn().mockReturnValue([]));
jest.mock('src/utils/api/ws', () => jest.fn().mockReturnValue([]));

jest.mock('@liskhq/lisk-client', () => ({
  ...jest.requireActual('@liskhq/lisk-client'),
  cryptography: {
    ...jest.requireActual('@liskhq/lisk-client').cryptography,
    address: {
      getLisk32AddressFromPublicKey: jest.fn(() => 'lskdgtenb76rf93bzd56cqn6ova46wfvoesbk4hnd'),
    },
  },
}));

describe.skip('API: LSK Account', () => {
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
});
