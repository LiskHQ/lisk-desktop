import http from 'src/utils/api/http';
import { subscribe, unsubscribe } from 'src/utils/api/ws';
import { httpPaths } from '@block/config';
import { getBlocks, blockSubscribe, blockUnsubscribe } from './index';

jest.mock('src/utils/api/http');
jest.mock('src/utils/api/ws');

describe('Block api module', () => {
  describe('getBlocks', () => {
    beforeEach(() => {
      http.mockClear();
    });

    it('should return blocks data', async () => {
      const expectedResponse = [{}, {}, {}];
      const params = { limit: 50, offset: 100 };
      http.mockImplementation(() => Promise.resolve(expectedResponse));
      await expect(getBlocks({ params })).resolves.toEqual(expectedResponse);
      expect(http).toHaveBeenCalledWith({
        path: httpPaths.block,
        params,
      });
    });

    it.skip('should handle filters correctly', async () => {
      jest.spyOn(global, 'Date').mockImplementation(() => ({
        valueOf: () => 100000000,
        getTime: () => 100000000,
      }));
      const params = {
        addressList: [
          'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11',
          'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y99',
        ],
        dateFrom: '02.02.2021',
        dateTo: '02.02.2021',
        generatorAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y33',
        limit: 50,
        offset: 100,
        sort: 'height:desc',
      };
      const expectedParams = {
        addressList: params.addressList,
        from: 100000,
        to: 100000,
        generatorAddress: params.generatorAddress,
        limit: params.limit,
        offset: params.offset,
        sort: 'height:desc',
      };
      const baseUrl = 'https://url.io';
      const network = {};
      getBlocks({ params, baseUrl, network });
      expect(http).toHaveBeenCalledWith({
        path: httpPaths.block,
        params: expectedParams,
        baseUrl,
        network,
      });
      params.addressList = [1, 2];
      delete params.dateTo;
      delete expectedParams.addressList;
      delete expectedParams.to;
      getBlocks({ params, baseUrl, network });
      expect(http).toHaveBeenCalledWith({
        path: httpPaths.block,
        params: expectedParams,
        baseUrl,
        network,
      });
    });

    it('should throw when api fails', async () => {
      const expectedResponse = new Error('API call could not be completed');
      http.mockImplementation(() => Promise.reject(new Error(expectedResponse.message)));
      await expect(getBlocks({})).rejects.toEqual(expectedResponse);
    });
  });

  describe('Block websocket', () => {
    it('Should call ws subscribe with parameters', () => {
      const fn = () => {};
      const serviceUrl = 'http://sample-service-url.com';
      subscribe.mockImplementation(() => {});

      blockSubscribe({ networks: { LSK: { serviceUrl } } }, fn, fn, fn);

      expect(subscribe).toHaveBeenCalledTimes(1);
      expect(subscribe).toHaveBeenCalledWith(
        `${serviceUrl}/blockchain`,
        'update.block',
        fn,
        fn,
        fn
      );
    });

    it('Should call ws unsubscribe with parameters', () => {
      blockUnsubscribe();
      expect(unsubscribe).toHaveBeenCalledTimes(1);
      expect(unsubscribe).toHaveBeenCalledWith('update.block');
    });
  });
});
