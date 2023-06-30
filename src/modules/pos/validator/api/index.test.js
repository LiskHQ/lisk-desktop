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

  describe('getValidators', () => {
    const addressList = [
      'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11',
      'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y12',
    ];

    beforeEach(() => {
      resetApiMock();
    });

    it('should ignore filtering parameters and call through websocket', async () => {
      await validator.getValidators({
        network,
        params: {
          addressList,
          limit: 5,
          offset: 3,
        },
      });
      expect(ws).toHaveBeenCalledWith({
        baseUrl: network.serviceUrl,
        requests: [
          {
            params: { address: addressList[0], isValidator: true },
            method: validator.wsMethods.validators,
          },
          {
            params: { address: addressList[1], isValidator: true },
            method: validator.wsMethods.validators,
          },
        ],
      });
    });

    it('should return validators list when addressList is passed and call through websocket', async () => {
      const expectedResponse = [{}, {}, {}];
      const data = {
        params: { addressList },
        network,
      };
      setApiResponseData(expectedResponse, ws);
      await expect(validator.getValidators(data)).resolves.toEqual(expectedResponse);
      expect(client.rest).not.toHaveBeenCalled();
      expect(ws).toHaveBeenCalledWith({
        baseUrl: network.serviceUrl,
        requests: [
          {
            params: { address: addressList[0], isValidator: true },
            method: validator.wsMethods.validators,
          },
          {
            params: { address: addressList[1], isValidator: true },
            method: validator.wsMethods.validators,
          },
        ],
      });
    });

    it('should return validators list when filters are passed and call through http', async () => {
      const expectedResponse = [{}, {}, {}];
      const params = {
        limit: 10,
        offset: 2,
        search: 't',
        sort: 'productivity:asc',
        status: 'active',
      };
      setApiResponseData(expectedResponse, client.rest);
      await expect(validator.getValidators({ params, network })).resolves.toEqual(expectedResponse);
      expect(ws).not.toHaveBeenCalled();
      expect(client.rest).toHaveBeenCalledWith({
        baseUrl: undefined,
        url: validator.httpPaths.validators,
        params: { ...params, isValidator: true },
        network,
      });
    });

    it('should set baseUrl', () => {
      validator.getValidators({ baseUrl, network, params: { addressList } });
      expect(ws).toHaveBeenCalledWith({
        baseUrl,
        requests: [
          {
            params: { address: addressList[0], isValidator: true },
            method: validator.wsMethods.validators,
          },
          {
            params: { address: addressList[1], isValidator: true },
            method: validator.wsMethods.validators,
          },
        ],
      });
      validator.getValidators({
        baseUrl,
        network,
        params: { limit: 10, offset: 2 },
      });
      expect(client.rest).toHaveBeenCalledWith({
        baseUrl,
        url: validator.httpPaths.validators,
        params: { limit: 10, offset: 2, isValidator: true },
        network,
      });
    });

    it('should throw when api fails', async () => {
      const expectedResponse = new Error('API call could not be completed');
      setApiRejection(expectedResponse.message, client.rest);
      setApiRejection(expectedResponse.message, ws);
      await expect(validator.getValidators({ addressList })).rejects.toEqual(expectedResponse);
      await expect(validator.getValidators({ limit: 10, offset: 0 })).rejects.toEqual(
        expectedResponse
      );
    });
  });

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
