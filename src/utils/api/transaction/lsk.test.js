import {
  getTransaction,
  getTransactions,
  getTransactionStats,
} from './lsk';
import http from '../http';
import ws from '../ws';

jest.mock('../http', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../ws', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('API: LSK Transactions', () => {
  const network = { serviceUrl: 'http://sample.com/' };
  const baseUrl = 'http://custom-basse-url.com/';
  const sampleId = 'sample_id';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTransaction', () => {
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

  describe('getTransactionStats', () => {
    it('Should call http with given params', () => {
      const network = { serviceUrl: 'http://sample.com/' };
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
