import {
  getTransaction,
  getTransactionStats,
} from './lsk';
import http from '../http';

jest.mock('../http', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('API: LSK Transactions', () => {
  describe('getTransaction', () => {
    it('Should call http with given params', () => {
      const network = { serviceUrl: 'http://sample.com/' };
      const baseUrl = 'http://custom-basse-url.com/';
      const sampleId = 'sample_tx_id';

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
