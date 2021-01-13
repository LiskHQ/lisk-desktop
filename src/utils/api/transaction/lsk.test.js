import {
  getTransaction,
  getTransactions,
  getTransactionStats,
  getRegisteredDelegates,
} from './lsk';
import http from '../http';
import ws from '../ws';
import * as delegates from '../delegate';

jest.mock('../http', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => Promise.resolve({ data: [{ type: 0 }] })),
}));

jest.mock('../ws', () => ({
  __esModule: true,
  default: jest.fn()
    .mockImplementation(() => Promise.resolve({ data: [{ type: 0 }] })),
}));

jest.mock('../delegate', () => ({
  getDelegates: jest.fn(),
}));

describe('API: LSK Transactions', () => {
  const network = { serviceUrl: 'http://sample.com/' };
  const baseUrl = 'http://custom-basse-url.com/';
  const sampleId = 'sample_id';

  describe('getTransaction', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('Should call http with given params', () => {
      getTransaction({
        network,
        baseUrl,
        params: { id: sampleId },
      });

      expect(http).toHaveBeenCalledWith({
        path: '/api/v1/transactions',
        params: { id: sampleId },
        network,
        baseUrl,
      });
    });
  });

  describe('getTransactions', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should call WS with correct list of types', async () => {
      await getTransactions({
        network, params: { type: 'transfer' },
      });

      expect(ws).toHaveBeenCalledWith({
        baseUrl: 'http://sample.com/',
        requests: [
          { method: 'get.transactions', params: { type: 0 } },
          { method: 'get.transactions', params: { type: 8 } },
        ],
      });
    });

    it('should call http with block id', async () => {
      await getTransactions({
        network, params: { blockId: sampleId },
      });

      expect(http).toHaveBeenCalledWith({
        path: '/api/v1/transactions',
        params: { block: sampleId },
        network,
        baseUrl: undefined,
      });
    });

    it('should call http with filters', async () => {
      await getTransactions({
        network,
        params: {
          dateFrom: 1607446547094,
          dateTo: 1607446547094,
          amountFrom: 123445,
          amountTo: 123445,
          sort: 'amount:asc',
        },
      });

      expect(http).toHaveBeenCalledWith({
        network,
        path: '/api/v1/transactions',
        baseUrl: undefined,
        params: {
          from: 1607446547094,
          to: 1607446547094,
          min: 123445,
          max: 123445,
          sort: 'amount:asc',
        },
      });
    });

    it('should call http and ignore wrong filters', async () => {
      await getTransactions({
        network,
        params: {
          dateFrom: 'wrong_date',
          dateTo: 1607446547094,
          amountFrom: 'wrong_amount',
          amountTo: 123445,
          sort: 'wrong_sort',
        },
      });

      expect(http).toHaveBeenCalledWith({
        network,
        path: '/api/v1/transactions',
        baseUrl: undefined,
        params: {
          to: 1607446547094,
          max: 123445,
        },
      });
    });
  });

  describe('getRegisteredDelegates', () => {
    beforeEach(() => {
      ws.mockReset();
    });

    it('should throw if any of the API endpoints throw', async () => {
      // Mock promise failure
      ws.mockRejectedValue(new Error('Error fetching data.'));

      // call and anticipate failure
      await expect(getRegisteredDelegates({ network }))
        .rejects
        .toThrow('Error fetching data.');
    });

    it('should return correct stats of registered delegates', async () => {
      // create sample delegate registration transactions
      const txs = [1, 1, 1, 2, 2, 2, 3, 3, 3, 4]
        .map((item) => {
          const t = new Date();
          t.setMonth(t.getMonth() + item);
          return { timestamp: t.getTime(), type: 0 };
        });

      // mock internals
      delegates.getDelegates.mockResolvedValue({
        data: {},
        meta: { total: 10 },
      });
      ws.mockResolvedValue({
        data: txs,
        meta: { total: 10 },
      });

      // Call and expect right values
      const response = await getRegisteredDelegates({ network });
      expect(response).toEqual([0, 1, 4, 7, 10]);
    });
  });

  describe('getTransactionStats', () => {
    it('Should call http with given params', () => {
      getTransactionStats({
        network,
        params: { period: 'week' },
      });

      expect(http).toHaveBeenCalledWith({
        path: '/api/v1/transactions/statistics/day',
        params: { limit: 7 },
        network,
      });
    });
  });
});
