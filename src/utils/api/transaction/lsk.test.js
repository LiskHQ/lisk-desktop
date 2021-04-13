import { MODULE_ASSETS_NAME_ID_MAP } from '@constants';
import { getTxAmount } from '@utils/transaction';
import {
  getTransaction,
  getTransactions,
  getTransactionStats,
  getRegisteredDelegates,
  getTransactionFee,
  getSchemas,
} from './lsk';
import http from '../http';
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
        path: '/api/v2/transactions',
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

    it('should call http with block id', async () => {
      await getTransactions({
        network, params: { blockId: sampleId },
      });

      expect(http).toHaveBeenCalledWith({
        path: '/api/v2/transactions',
        params: { block: sampleId },
        network,
        baseUrl: undefined,
      });
    });

    it('should call http with filters', async () => {
      await getTransactions({
        network,
        params: {
          timestamp: '1607446547094:1607446547094',
          amount: '123445:123445',
          sort: 'amount:asc',
        },
      });

      expect(http).toHaveBeenCalledWith({
        network,
        path: '/api/v2/transactions',
        baseUrl: undefined,
        params: {
          timestamp: '1607446547094:1607446547094',
          amount: '123445:123445',
          sort: 'amount:asc',
        },
      });
    });

    it('should call http and ignore wrong filters', async () => {
      await getTransactions({
        network,
        params: {
          timestamp: 'wrong_date:1607446547094',
          amount: 'wrong_amount:123445',
          sort: 'wrong_sort',
          limit: 0,
          offset: -1,
          message: {},
          address: 'invalid_address',
        },
      });

      expect(http).toHaveBeenCalledWith({
        network,
        path: '/api/v2/transactions',
        baseUrl: undefined,
        params: {
        },
      });
    });
  });

  describe('getRegisteredDelegates', () => {
    beforeEach(() => {
      http.mockReset();
    });

    it('should throw if any of the API endpoints throw', async () => {
      // Mock promise failure
      http.mockRejectedValue(Error('Error fetching data.'));

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
      http.mockResolvedValue({
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
        path: '/api/v2/transactions/statistics/day',
        params: { limit: 7 },
        network,
      });
    });
  });

  describe('getTxAmount', () => {
    it('should return amount of transfer in Beddows', () => {
      const tx = {
        moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.transfer,
        asset: { amount: 100000000 },
      };

      expect(getTxAmount(tx)).toEqual(tx.asset.amount);
    });

    it('should return amount of votes in Beddows', () => {
      const tx = {
        title: MODULE_ASSETS_NAME_ID_MAP.voteDelegate,
        moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.voteDelegate,
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

      expect(getTxAmount(tx)).toEqual(200000000);
    });

    it('should return amount of unlock in Beddows', () => {
      const tx = {
        title: MODULE_ASSETS_NAME_ID_MAP.unlockToken,
        moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.unlockToken,
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

      expect(getTxAmount(tx)).toEqual(200000000);
    });
  });

  describe('getTransactionFee', () => {
    const txData = {
      amount: '100000000',
      data: 'to test the instance',
      nonce: '6',
      recipientAddress: 'lskz5kf62627u2n8kzqa8jpycee64pgxzutcrbzhz',
      senderPublicKey: 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f',
      moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.transfer,
    };
    const selectedPriority = {
      value: 0,
      title: 'LOW',
    };
    it('should return fee in Beddows', async () => {
      const result = await getTransactionFee({
        transaction: txData, selectedPriority,
      });
      expect(result.value).toEqual(0.0015);
    });

    it('should use zero instead of invalid amounts', async () => {
      const invalidAmountResult = await getTransactionFee({
        transaction: {
          ...txData,
          amount: 'invalid',
        },
        selectedPriority,
      });
      const ZeroAmountResult = await getTransactionFee({
        transaction: {
          ...txData,
          amount: '0',
        },
        selectedPriority,
      });
      expect(invalidAmountResult.value).toEqual(ZeroAmountResult.value);
    });

    it('should calculate fee of vote tx', async () => {
      const voteTxData = {
        moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.voteDelegate,
        nonce: '6',
        senderPublicKey: 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f',
        votes: [],
      };
      const result = await getTransactionFee({
        transaction: voteTxData,
        selectedPriority,
      });
      expect(result.value).toEqual(0.00114);
    });

    it('should calculate fee of register delegate tx', async () => {
      const voteTxData = {
        moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.registerDelegate,
        nonce: '6',
        senderPublicKey: 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f',
        username: 'some_username',
      };
      const result = await getTransactionFee({
        transaction: voteTxData,
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
        baseUrl,
      });
    });
  });
});
