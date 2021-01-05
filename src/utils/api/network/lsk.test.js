import {
  getConnectedPeers,
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
});
