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
  default: jest.fn(),
}));

jest.mock('../ws', () => ({
  __esModule: true,
  default: jest.fn(),
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
        id: sampleId,
      });

      expect(http).toHaveBeenCalledWith({
        path: 'transactions',
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
        path: 'transactions',
        params: { block: sampleId },
        network,
        baseUrl: undefined,
      });
    });

    it('should call http with filters', async () => {
      await getTransactions({
        network,
        params: {
          dateFrom: 'from_date',
          dateTo: 'to_date',
          amountFrom: 'amount_from',
          amountTo: 'amount_to',
          sort: 'amount:asc',
        },
      });

      expect(http).toHaveBeenCalledWith({
        network,
        path: 'transactions',
        baseUrl: undefined,
        params: {
          from: 'from_date',
          to: 'to_date',
          min: 'amount_from',
          max: 'amount_to',
          sort: 'amount:asc',
        },
      });
    });

    it('should call http and ignore wrong filters', async () => {
      await getTransactions({
        network,
        params: {
          dateFrom: 12345,
          dateTo: 'to_date',
          amountFrom: 123445,
          amountTo: 'amount_to',
          sort: 'wrong_sort',
        },
      });

      expect(http).toHaveBeenCalledWith({
        network,
        path: 'transactions',
        baseUrl: undefined,
        params: {
          to: 'to_date',
          max: 'amount_to',
        },
      });
    });
  });

  describe.skip('getRegisteredDelegates', () => {
    it('should throw if any of the API endpoints throw', () => {

    });

    it('should return correct stats of registered delegates', async () => {
      const txs = [1, 1, 1, 2, 2, 2, 3, 3, 3, 4]
        .map((item) => {
          const t = new Date();
          t.setMonth(t.getMonth() + item);
          return { timestamp: t.getTime() };
        });
      delegates.getDelegates.mockResolvedValue({
        data: {},
        meta: { total: 10 },
      });
      getTransactions.mockResolvedValue({
        data: txs,
        meta: { total: 10 },
      });

      const response = await getRegisteredDelegates({ network });
      expect(response).toEqual([]);

      // delegates.getDelegates.mockReset();
      // getTransactions.mockReset();
    });
  });

  describe('getTransactionStats', () => {
    it('Should call http with given params', () => {
      const params = { period: 'day', limit: 7 };

      getTransactionStats({
        network,
        params,
      });

      expect(http).toHaveBeenCalledWith({
        path: `transactions/statistics/${params.period}`,
        params: { limit: params.limit },
        network,
      });
    });
  });
});
