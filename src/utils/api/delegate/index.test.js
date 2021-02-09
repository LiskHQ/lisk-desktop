import accounts from '../../../../test/constants/accounts';
import http from '../http';
import ws, { subscribe, unsubscribe } from '../ws';
import { extractAddress } from '../../account';

import * as delegate from './index';

jest.mock('../http');
jest.mock('../ws');

const setApiResponseData = (data, api) => {
  api.mockImplementation(() => Promise.resolve(data));
};
const setApiRejection = (statusText, api) => {
  api.mockImplementation(() => Promise.reject(new Error(statusText)));
};
const resetApiMock = () => {
  http.mockClear();
  ws.mockClear();
};

describe('API: LSK Delegates', () => {
  const baseUrl = 'http://baseurl.io';
  const network = {
    networks: {
      LSK: { serviceUrl: 'http://testnet.io' },
    },
  };

  describe('getDelegate', () => {
    beforeEach(() => {
      resetApiMock();
    });

    it('should return delegate data', async () => {
      const expectedResponse = { address: '1L', username: 'del1', data: {} };
      const params = { address: '1L' };
      setApiResponseData(expectedResponse, http);
      await expect(delegate.getDelegate({ params, network })).resolves.toEqual(expectedResponse);
      expect(http).toHaveBeenCalledWith({
        baseUrl: undefined,
        path: delegate.httpPaths.delegates,
        params,
        network,
      });
    });

    it('should return delegate data with username when it is passed', async () => {
      const expectedResponse = { username: 'del1', data: {} };
      const params = { username: 'del1' };
      setApiResponseData(expectedResponse, http);
      await expect(delegate.getDelegate({ params, network })).resolves.toEqual(expectedResponse);
      expect(http).toHaveBeenCalledWith({
        baseUrl: undefined,
        path: delegate.httpPaths.delegates,
        params,
        network,
      });
    });

    it('should return delegate data with address when publicKey is passed', async () => {
      const address = accounts.genesis.address;
      const expectedResponse = { address: extractAddress(address), data: {} };
      const params = { publicKey: accounts.genesis.publicKey };
      setApiResponseData(expectedResponse, http);
      await expect(delegate.getDelegate({ params, network })).resolves.toEqual(expectedResponse);
      expect(http).toHaveBeenCalledWith({
        baseUrl: undefined,
        path: delegate.httpPaths.delegates,
        params: { address },
        network,
      });
    });

    it('should set baseUrl', () => {
      const params = { address: '1L' };
      delegate.getDelegate({ params, baseUrl, network });
      expect(http).toHaveBeenCalledWith({
        baseUrl,
        path: delegate.httpPaths.delegates,
        params,
        network,
      });
    });

    it('should throw when api fails', async () => {
      const expectedResponse = new Error('API call could not be completed');
      const data = { address: '1L' };
      setApiRejection(expectedResponse.message, http);
      await expect(delegate.getDelegate(data)).rejects.toEqual(expectedResponse);
    });
  });

  describe('getDelegates', () => {
    const addressList = ['1L', '2L'];

    beforeEach(() => {
      resetApiMock();
    });

    it('should ignore filtering parameters and call through websocket', async () => {
      await delegate.getDelegates({
        network,
        params: {
          addressList, limit: 5, offset: 3,
        },
      });
      expect(ws).toHaveBeenCalledWith({
        baseUrl: network.serviceUrl,
        requests: [
          { params: { address: addressList[0] }, method: delegate.wsMethods.delegates },
          { params: { address: addressList[1] }, method: delegate.wsMethods.delegates },
        ],
      });
    });

    it('should return delegates list when addressList is passed and call through websocket', async () => {
      const expectedResponse = [{}, {}, {}];
      const data = {
        params: { addressList },
        network,
      };
      setApiResponseData(expectedResponse, ws);
      await expect(delegate.getDelegates(data)).resolves.toEqual(expectedResponse);
      expect(http).not.toHaveBeenCalled();
      expect(ws).toHaveBeenCalledWith({
        baseUrl: network.serviceUrl,
        requests: [
          { params: { address: addressList[0] }, method: delegate.wsMethods.delegates },
          { params: { address: addressList[1] }, method: delegate.wsMethods.delegates },
        ],
      });
    });

    it('should return delegates list when filters are passed and call through http', async () => {
      const expectedResponse = [{}, {}, {}];
      const params = {
        limit: 10, offset: 2, search: 't', sort: 'productivity:asc', status: 'active',
      };
      setApiResponseData(expectedResponse, http);
      await expect(
        delegate.getDelegates({ params, network }),
      ).resolves.toEqual(expectedResponse);
      expect(ws).not.toHaveBeenCalled();
      expect(http).toHaveBeenCalledWith({
        baseUrl: undefined,
        path: delegate.httpPaths.delegates,
        params,
        network,
      });
    });

    it('should set baseUrl', () => {
      delegate.getDelegates({ baseUrl, network, params: { addressList } });
      expect(ws).toHaveBeenCalledWith({
        baseUrl,
        requests: [
          { params: { address: addressList[0] }, method: delegate.wsMethods.delegates },
          { params: { address: addressList[1] }, method: delegate.wsMethods.delegates },
        ],
      });
      delegate.getDelegates({
        baseUrl, network, params: { limit: 10, offset: 2 },
      });
      expect(http).toHaveBeenCalledWith({
        baseUrl,
        path: delegate.httpPaths.delegates,
        params: { limit: 10, offset: 2 },
        network,
      });
    });

    it('should throw when api fails', async () => {
      const expectedResponse = new Error('API call could not be completed');
      setApiRejection(expectedResponse.message, http);
      setApiRejection(expectedResponse.message, ws);
      await expect(
        delegate.getDelegates({ addressList }),
      ).rejects.toEqual(expectedResponse);
      await expect(
        delegate.getDelegates({ limit: 10, offset: 0 }),
      ).rejects.toEqual(expectedResponse);
    });
  });

  describe('getVotes', () => {
    const address = '1L';

    beforeEach(() => {
      resetApiMock();
    });

    it('should return votes list when address is passed', async () => {
      const expectedResponse = [{}, {}, {}];
      const params = { address };
      setApiResponseData(expectedResponse, http);
      await expect(delegate.getVotes({ params, network })).resolves.toEqual(expectedResponse);
      expect(http).toHaveBeenCalledWith({
        baseUrl: undefined,
        path: delegate.httpPaths.votesSent,
        params,
        network,
      });
    });

    it('should set baseUrl', () => {
      const params = { address };
      delegate.getVotes({ params, network, baseUrl });
      expect(http).toHaveBeenCalledWith({
        baseUrl,
        path: delegate.httpPaths.votesSent,
        params,
        network,
      });
    });

    it('should throw when api fails', async () => {
      const expectedResponse = new Error('API call could not be completed');
      setApiRejection(expectedResponse.message, http);
      await expect(
        delegate.getVotes({ address }),
      ).rejects.toEqual(expectedResponse);
    });
  });

  describe('getVoters', () => {
    const address = '1L';

    beforeEach(() => {
      resetApiMock();
    });

    it('should return votes list when address is passed', async () => {
      const expectedResponse = [{}, {}, {}];
      const params = { address };
      setApiResponseData(expectedResponse, http);
      await expect(delegate.getVoters({ params, network })).resolves.toEqual(expectedResponse);
      expect(http).toHaveBeenCalledWith({
        baseUrl: undefined,
        path: delegate.httpPaths.votesReceived,
        params,
        network,
      });
    });

    it('should return votes list when address, filters and baseURL are passed', async () => {
      const expectedResponse = [{}, {}, {}];
      const params = {
        address, limit: 3, offset: 2,
      };
      setApiResponseData(expectedResponse, http);
      await expect(
        delegate.getVoters({ params, baseUrl, network }),
      ).resolves.toEqual(expectedResponse);
      expect(http).toHaveBeenCalledWith({
        baseUrl,
        path: delegate.httpPaths.votesReceived,
        params,
        network,
      });
    });

    it('should set baseUrl', () => {
      const params = {
        address, limit: 3, offset: 2,
      };
      delegate.getVoters({ params, baseUrl, network });
      expect(http).toHaveBeenCalledWith({
        baseUrl,
        path: delegate.httpPaths.votesReceived,
        params,
        network,
      });
    });

    it('should throw when api fails', async () => {
      const expectedResponse = new Error('API call could not be completed');
      setApiRejection(expectedResponse.message, http);
      await expect(
        delegate.getVoters({ address }),
      ).rejects.toEqual(expectedResponse);
    });
  });

  describe('getForgers', () => {
    beforeEach(() => {
      resetApiMock();
    });

    it('should return forgers list', async () => {
      const expectedResponse = [{}, {}, {}];
      setApiResponseData(expectedResponse, http);
      await expect(
        delegate.getForgers({ params: { limit: 5, offset: 0 }, network }),
      ).resolves.toEqual(expectedResponse);
      expect(http).toHaveBeenCalledWith({
        baseUrl: undefined,
        path: delegate.httpPaths.forgers,
        params: { limit: 5, offset: 0 },
        network,
      });
    });

    it('should set baseUrl', () => {
      const params = { limit: 5, offset: 0 };
      delegate.getForgers({
        baseUrl, network, params,
      });
      expect(http).toHaveBeenCalledWith({
        baseUrl,
        path: delegate.httpPaths.forgers,
        params,
        network,
      });
    });

    it('should throw when api fails', async () => {
      const expectedResponse = new Error('API call could not be completed');
      setApiRejection(expectedResponse.message, http);
      await expect(
        delegate.getForgers({
          network,
          params: { limit: 5, offset: 0 },
        }),
      ).rejects.toEqual(expectedResponse);
    });
  });

  describe('forgers websocket', () => {
    it('Should call ws subscribe with parameters', () => {
      const fn = () => {};
      const serviceUrl = 'http://sample-service-url.com';
      subscribe.mockImplementation(() => {});

      delegate.forgersSubscribe(
        { networks: { LSK: { serviceUrl } } }, fn, fn, fn,
      );

      expect(subscribe).toHaveBeenCalledTimes(1);
      expect(subscribe).toHaveBeenCalledWith(`${serviceUrl}/blockchain`, 'update.round', fn, fn, fn);
    });

    it('Should call ws unsubscribe with parameters', () => {
      delegate.forgersUnsubscribe();
      expect(unsubscribe).toHaveBeenCalledTimes(1);
      expect(unsubscribe).toHaveBeenCalledWith('update.round');
    });
  });
});
