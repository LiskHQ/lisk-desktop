import {
  getConnectedPeers,
  getNetworkStatistics,
  getNetworkStatus,
} from './lsk';
import http from '../http';

jest.mock('../http');

const setApiResponseData = (data, api) => {
  api.mockImplementation(() => Promise.resolve(data));
};
const setApiRejection = (statusText, api) => {
  api.mockImplementation(() => Promise.reject(new Error(statusText)));
};
const resetApiMock = () => {
  http.mockClear();
};

describe('API: LSK Network', () => {
  const network = { serviceUrl: 'http://testnet.io' };

  describe('getConnectedPeers', () => {
    beforeEach(() => {
      resetApiMock();
    });

    it('should return list of connected peers', async () => {
      const expectedResponse = {
        data: [{
          ip: '135.181.46.133',
          version: '3.0.0-beta.1',
          height: 449442,
        }],
      };
      setApiResponseData(expectedResponse, http);
      await expect(getConnectedPeers({ network, params: { version: '3.0' } })).resolves.toEqual(expectedResponse);
      expect(http).toHaveBeenCalledWith({
        baseUrl: undefined,
        path: '/api/v1/peers/connected',
        params: { version: '3.0' },
        network,
      });
    });

    it('should throw when api fails', async () => {
      const expectedResponse = new Error('API call could not be completed');
      setApiRejection(expectedResponse.message, http);
      await expect(getConnectedPeers({ network, params: {} })).rejects.toEqual(expectedResponse);
    });
  });

  describe('getNetworkStatistics', () => {
    beforeEach(() => {
      resetApiMock();
    });

    it('should return statistics of the network', async () => {
      const expectedResponse = {
        data: {
          basic: {
            totalPeers: 22,
            connectedPeers: 22,
            disconnectedPeers: 0,
          },
          coreVer: {
            '3.0.0-beta.1': 22,
          },
          height: {
            449486: 22,
          },
        },
      };
      setApiResponseData(expectedResponse, http);
      await expect(getNetworkStatistics({ network })).resolves.toEqual(expectedResponse);
      expect(http).toHaveBeenCalledWith({
        path: '/api/v1/network/statistics',
        network,
      });
    });

    it('should throw when api fails', async () => {
      const expectedResponse = new Error('API call could not be completed');
      setApiRejection(expectedResponse.message, http);
      await expect(getNetworkStatistics({ network })).rejects.toEqual(expectedResponse);
    });
  });

  describe('getNetworkStatus', () => {
    beforeEach(() => {
      resetApiMock();
    });

    it('should return network status info', async () => {
      const expectedResponse = {
        data: {
          height: 449520,
          networkHeight: 449520,
          epoch: '2016-05-24T17:00:00.000Z',
          nethash: 'sample_nethassh',
          supply: '100000000000',
          reward: '50000000',
        },
      };
      setApiResponseData(expectedResponse, http);
      await expect(getNetworkStatus({ network })).resolves.toEqual(expectedResponse);
      expect(http).toHaveBeenCalledWith({
        path: '/api/v1/network/status',
        network,
      });
    });

    it('should throw when api fails', async () => {
      const expectedResponse = new Error('API call could not be completed');
      setApiRejection(expectedResponse.message, http);
      await expect(getNetworkStatus({ network })).rejects.toEqual(expectedResponse);
    });
  });
});
