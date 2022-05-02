import http from '@common/utilities/api/http';
import {
  getTransaction,
  getTransactions,
  calculateTransactionFee,
} from './btc';

jest.mock('@common/utilities/api/http', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('API: BTC Transactions', () => {
  const network = {
    serviceUrl: 'http://sample.com/',
    networks: {
      BTC: {
        name: 'mainnet',
        serviceUrl: 'http://btc.io',
      },
    },
  };
  const sampleId = 'sample_id';
  const sampleTx = i => ({
    txid: `sample_id_${i}`,
    timestamp: 1607352618,
    confirmations: i,
    feeSatoshi: 1000,
    tx: {
      inputs: [
        {
          txDetail: {
            scriptPubKey: { addresses: ['3DjJKAX3JztZ5wAqPGNe1qmGPTdK76adZt'] },
          },
        },
      ],
      outputs: [
        {
          scriptPubKey: { addresses: ['3P7J9iUSEbpfpkjXkhbMqNTSepcXzMSTmg'] },
          satoshi: 1000 * (i + 1),
        },
      ],
    },
  });

  describe('getTransaction', () => {
    it('Should call http with given params', async () => {
      jest.clearAllMocks();
      http.mockImplementation(() =>
        Promise.resolve({
          data: sampleTx(0),
          meta: { total: 1 },
        }));
      await getTransaction({
        network,
        params: { transactionId: sampleId },
      });

      expect(http).toHaveBeenCalledWith({
        baseUrl: 'http://btc.io',
        params: {},
        network,
        path: `/transaction/${sampleId}`,
      });
    });
  });

  describe('getTransactions', () => {
    it('Should call http with given params', async () => {
      const total = 10;
      const address = 'sample_address';
      const params = {
        offset: total,
        limit: total,
        sort: 'amount:asc',
      };
      jest.clearAllMocks();
      http.mockImplementation(() =>
        Promise.resolve({
          data: Array.from(Array(total).keys()).map(sampleTx),
          meta: { total },
        }));
      await getTransactions({
        network,
        params: {
          ...params,
          address,
        },
      });

      expect(http).toHaveBeenCalledWith({
        baseUrl: 'http://btc.io',
        params,
        network,
        path: `/transactions/${address}`,
      });
    });

    it('should call http with block id', async () => {
      const total = 1;
      const blockId = 'block_id';
      const params = { blockId };
      jest.clearAllMocks();
      http.mockImplementation(() =>
        Promise.resolve({
          data: Array.from(Array(total).keys()).map(sampleTx),
          meta: { total },
        }));
      await getTransactions({
        network,
        params,
      });

      expect(http).toHaveBeenCalledWith({
        baseUrl: 'http://btc.io',
        params: { block: blockId },
        network,
        path: '/transactions',
      });
    });

    it('Should not allow call with wrong params', async () => {
      const params = {
        sort: 'invalid',
        dateFrom: 'invalid',
        dateTo: 'invalid',
        amountFrom: 'invalid',
        amountTo: 'invalid',
      };
      jest.clearAllMocks();
      http.mockRejectedValue(new Error('Error fetching data.'));

      await expect(getTransactions({
        network,
        params,
      }))
        .rejects
        .toThrow('Error fetching data.');
    });
  });

  describe('calculateTransactionFee', () => {
    expect(calculateTransactionFee({
      inputCount: 10,
      outputCount: 10,
      selectedFeePerByte: 1,
    })).toBe(2160);
  });
});
