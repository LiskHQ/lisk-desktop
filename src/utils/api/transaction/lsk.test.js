import { MODULE_ASSETS_NAME_ID_MAP } from '@constants';
import {
  getTransaction,
  getTransactions,
  getTransactionStats,
  getRegisteredDelegates,
  getTxAmount,
  getTransactionFee,
  getSchemas,
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
          limit: 0,
          offset: -1,
          message: {},
          address: 'invalid_address',
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
      ws.mockRejectedValue(Error('Error fetching data.'));

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

  describe('getTxAmount', () => {
    it('should return amount of transfer in Beddows', () => {
      const tx = {
        amount: '100000000',
        type: 0,
      };

      expect(getTxAmount(tx)).toEqual(tx.amount);
    });

    it('should return amount of votes in Beddows', () => {
      const tx = {
        title: MODULE_ASSETS_NAME_ID_MAP.voteDelegate,
        type: MODULE_ASSETS_NAME_ID_MAP.voteDelegate,
        asset: {
          votes: [
            {
              amount: '100000000',
            },
            {
              amount: '100000000',
            },
          ],
        },
      };

      expect(getTxAmount(tx)).toEqual('200000000');
    });

    it('should return amount of unlock in Beddows', () => {
      const tx = {
        title: MODULE_ASSETS_NAME_ID_MAP.unlockToken,
        type: MODULE_ASSETS_NAME_ID_MAP.unlockToken,
        asset: {
          unlockingObjects: [
            {
              amount: '100000000',
            },
            {
              amount: '100000000',
            },
          ],
        },
      };

      expect(getTxAmount(tx)).toEqual('200000000');
    });
  });

  describe('getTransactionFee', () => {
    const txData = {
      amount: '100000000',
      data: 'to test the instance',
      nonce: '6',
      recipient: '16313739661670634666L',
      senderPublicKey: 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f',
      txType: 'transfer',
    };
    const selectedPriority = {
      value: 0,
      title: 'LOW',
    };
    it('should return fee in Beddows', async () => {
      const result = await getTransactionFee({
        txData, selectedPriority,
      });
      expect(result.value).toEqual(0.0015);
    });

    it('should use zero instead of invalid amounts', async () => {
      const invalidAmountResult = await getTransactionFee({
        txData: {
          ...txData,
          amount: 'invalid',
        },
        selectedPriority,
      });
      const ZeroAmountResult = await getTransactionFee({
        txData: {
          ...txData,
          amount: '0',
        },
        selectedPriority,
      });
      expect(invalidAmountResult.value).toEqual(ZeroAmountResult.value);
    });

    it('should calculate fee of vote tx', async () => {
      const voteTxData = {
        txType: 'vote',
        nonce: '6',
        senderPublicKey: 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f',
        votes: [],
      };
      const result = await getTransactionFee({
        txData: voteTxData,
        selectedPriority,
      });
      expect(result.value).toEqual(0.00114);
    });

    it('should calculate fee of register delegate tx', async () => {
      const voteTxData = {
        txType: 'registerDelegate',
        nonce: '6',
        senderPublicKey: 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f',
      };
      const result = await getTransactionFee({
        txData: voteTxData,
        selectedPriority,
      });
      expect(result.value).toEqual(10.00119);
    });
  });

  describe('getSchemas', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('Should call http with given params', () => {
      getSchemas({
        network,
        baseUrl,
      });

      expect(http).toHaveBeenCalledWith({
        path: '/api/v2/transactions/schemas',
        network,
        baseUrl,
      });
    });
  });
});
