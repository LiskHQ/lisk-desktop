import { subscribe, unsubscribe } from '@common/utilities/api/ws';
import * as block from './index';

jest.mock('../http');
jest.mock('../ws');

describe('Block api module', () => {
  describe('getBlock', () => {
    beforeEach(() => {
      http.mockClear();
    });

    it('should return block data', async () => {
      const expectedResponse = { data: {} };
      const params = { blockId: 1 };
      http.mockImplementation(() => Promise.resolve(expectedResponse));
      await expect(block.getBlock({ params })).resolves.toEqual(expectedResponse);
      expect(http).toHaveBeenCalledWith({
        path: block.httpPaths.block,
        params,
      });
    });

    it('should handle parameters correctly', async () => {
      block.getBlock({ params: { blockId: 1, height: 5000 } });
      expect(http).toHaveBeenCalledWith({
        path: block.httpPaths.block,
        params: { blockId: 1 },
      });
      block.getBlock({ params: { height: 5000 } });
      expect(http).toHaveBeenCalledWith({
        path: block.httpPaths.block,
        params: { height: 5000 },
      });
    });

    it('should return promise rejection when no parameters are sup', async () => {
      await expect(
        block.getBlock({ params: { } }),
      ).rejects.toEqual(Error('No parameters supplied'));
    });

    it('should throw when api fails', async () => {
      const expectedResponse = new Error('API call could not be completed');
      const params = { blockId: 1 };
      http.mockImplementation(() => Promise.reject(new Error(expectedResponse.message)));
      await expect(block.getBlock({ params })).rejects.toEqual(expectedResponse);
    });
  });

  describe('getBlocks', () => {
    beforeEach(() => {
      http.mockClear();
    });

    it('should return blocks data', async () => {
      const expectedResponse = [{}, {}, {}];
      const params = { limit: 50, offset: 100 };
      http.mockImplementation(() => Promise.resolve(expectedResponse));
      await expect(block.getBlocks({ params })).resolves.toEqual(expectedResponse);
      expect(http).toHaveBeenCalledWith({
        path: block.httpPaths.block,
        params,
      });
    });

    it.skip('should handle filters correctly', async () => {
      jest.spyOn(global, 'Date').mockImplementation(() => ({
        valueOf: () => 100000000,
        getTime: () => 100000000,
      }));
      const params = {
        addressList: ['lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11', 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y99'],
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
      block.getBlocks({ params, baseUrl, network });
      expect(http).toHaveBeenCalledWith({
        path: block.httpPaths.block,
        params: expectedParams,
        baseUrl,
        network,
      });
      params.addressList = [1, 2];
      delete params.dateTo;
      delete expectedParams.addressList;
      delete expectedParams.to;
      block.getBlocks({ params, baseUrl, network });
      expect(http).toHaveBeenCalledWith({
        path: block.httpPaths.block,
        params: expectedParams,
        baseUrl,
        network,
      });
    });

    it('should throw when api fails', async () => {
      const expectedResponse = new Error('API call could not be completed');
      http.mockImplementation(() => Promise.reject(new Error(expectedResponse.message)));
      await expect(block.getBlocks({})).rejects.toEqual(expectedResponse);
    });
  });

  describe('Block websocket', () => {
    it('Should call ws subscribe with parameters', () => {
      const fn = () => {};
      const serviceUrl = 'http://sample-service-url.com';
      subscribe.mockImplementation(() => {});

      block.blockSubscribe(
        { networks: { LSK: { serviceUrl } } }, fn, fn, fn,
      );

      expect(subscribe).toHaveBeenCalledTimes(1);
      expect(subscribe).toHaveBeenCalledWith(`${serviceUrl}/blockchain`, 'update.block', fn, fn, fn);
    });

    it('Should call ws unsubscribe with parameters', () => {
      block.blockUnsubscribe();
      expect(unsubscribe).toHaveBeenCalledTimes(1);
      expect(unsubscribe).toHaveBeenCalledWith('update.block');
    });
  });
});
