import http from 'src/utils/api/http';
import * as market from './index';

jest.mock('../http');

describe('API: Market', () => {
  describe('getPrices', () => {
    beforeEach(() => {
      http.mockClear();
    });

    it('should return prices data', async () => {
      const expectedResponse = { data: [{}, {}] };
      http.mockImplementation(() => Promise.resolve(expectedResponse));
      await expect(
        market.getPrices({
          network: { networks: { LSK: { serviceUrl: 'example.com' } } },
        })
      ).resolves.toEqual(expectedResponse);

      expect(http).toHaveBeenCalledWith({
        path: market.httpPaths.prices,
        network: { networks: { LSK: { serviceUrl: 'example.com' } } },
      });
    });

    it('should throw when api fails', async () => {
      const expectedResponse = new Error('API call could not be completed');
      http.mockImplementation(() => Promise.reject(new Error(expectedResponse.message)));
      await expect(
        market.getPrices({
          network: { networks: { LSK: { serviceUrl: 'example.com' } } },
        })
      ).rejects.toEqual(expectedResponse);
    });
  });
});
