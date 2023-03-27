import http from 'src/utils/api/http';
import { getPeers, getNetworkStatistics, getNetworkStatus } from './index';

jest.mock('src/utils/api/http');

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

  describe('getPeers', () => {
    beforeEach(() => {
      resetApiMock();
    });

    it('should return list of connected peers', async () => {
      const expectedResponse = {
        data: [
          {
            ip: '135.181.46.133',
            version: '3.0.0-beta.1',
            height: 449442,
          },
        ],
      };
      setApiResponseData(expectedResponse, http);
      await expect(getPeers({ network, params: { version: '3.0' } })).resolves.toEqual(
        expectedResponse
      );
      expect(http).toHaveBeenCalledWith({
        baseUrl: undefined,
        path: '/api/v3/peers',
        params: { version: '3.0' },
        network,
      });
    });

    it('should throw when api fails', async () => {
      const expectedResponse = new Error('API call could not be completed');
      setApiRejection(expectedResponse.message, http);
      await expect(getPeers({ network, params: {} })).rejects.toEqual(expectedResponse);
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
        path: '/api/v3/network/statistics',
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
          height: '449520',
          blockTime: 10,
          communityIdentifier: 'LISK',
          finalizedHeight: 20533,
          currentReward: 500000000,
          maxPayloadLength: 15360,
          minRemainingBalance: '5000000',
          moduleAssets: [
            { id: 'token:transfer', name: 'token:transfer' },
            { id: 'auth:registerMultisignature', name: 'keys:registerMultisignature' },
            { id: 'pos:registerValidator', name: 'pos:registerValidator' },
            { id: 'pos:stake', name: 'pos:stake' },
            { id: 'pos:unlock', name: 'pos:unlockToken' },
            { id: 'pos:reportMisbehavior', name: 'pos:reportMisbehavior' },
            { id: 'legacy:reclaimLSK', name: 'legacyAccount:reclaimLSK' },
          ],
          milestone: ['500000000', '400000000', '300000000', '200000000', '100000000'],
          rewards: {
            distance: 3000000,
            milestones: ['500000000', '400000000', '300000000', '200000000', '100000000'],
            offset: 2160,
          },
          registeredModules: ['token', 'sequence', 'keys', 'pos', 'legacyAccount'],
        },
      };
      setApiResponseData(expectedResponse, http);
      await expect(getNetworkStatus({ network })).resolves.toEqual(expectedResponse);
      expect(http).toHaveBeenCalledWith(
        expect.objectContaining({
          path: '/api/v3/network/status',
        })
      );
    });

    it('should throw when api fails', async () => {
      const expectedResponse = new Error('API call could not be completed');
      setApiRejection(expectedResponse.message, http);
      await expect(getNetworkStatus({ network })).rejects.toEqual(expectedResponse);
    });
  });
});
