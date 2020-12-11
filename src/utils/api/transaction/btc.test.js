import { getTransaction, getTransactions } from './btc';
import http from '../http';

jest.mock('../http', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('API: BTC Transactions', () => {
  const path = 'transactions';
  const network = {
    serviceUrl: 'http://sample.com/',
    networks: {
      BTC: {
        name: 'mainnet',
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
      http.mockResolvedValue({
        body: {
          data: sampleTx(0),
          meta: { total: 1 },
        },
      });
      await getTransaction({
        network,
        id: sampleId,
      });

      expect(http).toHaveBeenCalledWith({
        params: { id: sampleId },
        network,
        path,
      });
    });
  });

  describe('getTransactions', () => {
    it('Should call http with given params', async () => {
      const total = 10;
      const params = {
        offset: total,
        limit: total,
        sort: 'amount:asc',
      };
      jest.clearAllMocks();
      http.mockResolvedValue({
        body: {
          data: Array.from(Array(total).keys()).map(sampleTx),
          meta: { total },
        },
      });
      await getTransactions({
        network,
        params,
      });

      expect(http).toHaveBeenCalledWith({
        params,
        network,
        path,
      });
    });

    it('Should not allow call with wrong params', async () => {
      const params = {
        sort: 'wrong_sort_value',
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
});
