import client from 'src/utils/api/client';
import ws from 'src/utils/api/ws';

import * as validator from './index';
import { mockSentStakes } from '../__fixtures__';

jest.mock('src/utils/api/client');
jest.mock('src/utils/api/ws');

const setApiResponseData = (data, api) => {
  api.mockImplementation(() => Promise.resolve(data));
};
const setApiRejection = (statusText, api) => {
  api.mockImplementation(() => Promise.reject(new Error(statusText)));
};
const resetApiMock = () => {
  client.rest.mockClear();
  ws.mockClear();
};

describe('API: LSK Validators', () => {
  const baseUrl = 'http://baseurl.io';
  const network = {
    networks: {
      LSK: { serviceUrl: 'http://testnet.io' },
    },
  };

  describe('getStakes', () => {
    const address = 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11';

    beforeEach(() => {
      resetApiMock();
    });

    it('should return stakes list when address is passed', async () => {
      const params = { address };
      const expectedResponse = {
        ...mockSentStakes,
        meta: { ...mockSentStakes.meta, count: 20 },
      };
      setApiResponseData(expectedResponse, client.rest);
      await expect(validator.getStakes({ params, network })).resolves.toEqual(expectedResponse);
    });
  });

  describe('getStakers', () => {
    const address = 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11';

    beforeEach(() => {
      resetApiMock();
    });

    it('should return stakes list when address is passed', async () => {
      const expectedResponse = [{}, {}, {}];
      const params = { address };
      setApiResponseData(expectedResponse, client.rest);
      await expect(validator.getStakers({ params, network })).resolves.toEqual(expectedResponse);
      expect(client.rest).toHaveBeenCalledWith({
        baseUrl: undefined,
        url: validator.httpPaths.stakers,
        params,
        network,
      });
    });

    it('should return stakes list when address, filters and baseURL are passed', async () => {
      const expectedResponse = [{}, {}, {}];
      const params = {
        address,
        limit: 3,
        offset: 2,
      };
      setApiResponseData(expectedResponse, client.rest);
      await expect(validator.getStakers({ params, baseUrl, network })).resolves.toEqual(
        expectedResponse
      );
      expect(client.rest).toHaveBeenCalledWith({
        baseUrl,
        url: validator.httpPaths.stakers,
        params,
        network,
      });
    });

    it('should set baseUrl', () => {
      const params = {
        address,
        limit: 3,
        offset: 2,
      };
      validator.getStakers({ params, baseUrl, network });
      expect(client.rest).toHaveBeenCalledWith({
        baseUrl,
        url: validator.httpPaths.stakers,
        params,
        network,
      });
    });

    it('should throw when api fails', async () => {
      const expectedResponse = new Error('API call could not be completed');
      setApiRejection(expectedResponse.message, client.rest);
      await expect(validator.getStakers({ address })).rejects.toEqual(expectedResponse);
    });
  });
});
