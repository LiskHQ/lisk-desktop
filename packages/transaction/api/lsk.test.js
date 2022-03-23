/* eslint-disable max-lines */
import { MODULE_ASSETS_NAME_ID_MAP } from '@common/configuration';
import { getTxAmount } from '@common/utilities/transaction';
import {
  getTransaction,
  getTransactions,
  getTransactionStats,
  getRegisteredDelegates,
  getTransactionFee,
  getSchemas,
} from '@token/utilities/lsk';
import functionMapper from '@common/utilities/api/http';
import * as delegates from '../delegate';
import accounts from '../../../../test/constants/accounts';
import { getState } from '../../../../test/fixtures/transactions';

const {
  transfer, voteDelegate, registerDelegate, registerMultisignatureGroup, unlockToken, reclaimLSK,
} = MODULE_ASSETS_NAME_ID_MAP;
const { network } = getState();

jest.mock('../http', () =>
  jest.fn().mockImplementation(() => Promise.resolve({ data: [{ type: 0 }] })));

jest.mock('../ws', () =>
  jest.fn().mockImplementation(() => Promise.resolve({ data: [{ type: 0 }] })));

jest.mock('../delegate', () => ({
  getDelegates: jest.fn(),
}));

describe('API: LSK Transactions', () => {
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
        params: { blockId: sampleId },
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
      const txs = [7, 6, 6, 6, 5, 5, 5, 4, 4, 4]
        .map(d => ({ block: { timestamp: (new Date(`2020-${d}-1`)).getTime() / 1000 } }));

      // mock internals
      delegates.getDelegates.mockResolvedValue({
        data: {},
        meta: { total: 100 },
      });
      http.mockResolvedValue({
        data: txs,
        meta: { total: 10 },
      });

      // Call and expect right values
      const response = await getRegisteredDelegates({ network });
      expect(response).toEqual([
        ['2020-3', 90], ['2020-4', 93], ['2020-5', 96], ['2020-6', 99], ['2020-7', 100],
      ]);
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
        moduleAssetId: transfer,
        asset: { amount: 100000000 },
      };

      expect(getTxAmount(tx)).toEqual(tx.asset.amount);
    });

    it('should return amount of votes in Beddows', () => {
      const tx = {
        title: voteDelegate,
        moduleAssetId: voteDelegate,
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
        title: unlockToken,
        moduleAssetId: unlockToken,
        asset: {
          unlockObjects: [
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
      moduleAssetId: transfer,
    };
    const selectedPriority = {
      value: 0,
      title: 'LOW',
    };

    it('should return fee in Beddows', async () => {
      const result = await getTransactionFee({
        transaction: txData,
        selectedPriority,
        network,
      });
      expect(Number(result.value)).toBeGreaterThan(0);
    });

    it('should calculate fee of vote tx', async () => {
      const voteTxData = {
        moduleAssetId: voteDelegate,
        nonce: '6',
        senderPublicKey: 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f',
        votes: [],
      };

      const result = await getTransactionFee({
        transaction: voteTxData,
        selectedPriority,
        network,
      });
      expect(Number(result.value)).toBeGreaterThan(0);
    });

    it('should calculate fee of register delegate tx', async () => {
      const voteTxData = {
        moduleAssetId: registerDelegate,
        nonce: '6',
        senderPublicKey: 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f',
        username: 'some_username',
      };

      const result = await getTransactionFee({
        transaction: voteTxData,
        selectedPriority,
        network,
      });
      expect(Number(result.value)).toBeGreaterThan(0);
    });

    it('should calculate fee of reclaimLSK tx', async () => {
      const transaction = {
        moduleAssetId: reclaimLSK,
        nonce: '1',
        senderPublicKey: 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f',
        amount: '4454300000',
      };
      const result = await getTransactionFee({
        transaction,
        selectedPriority,
        network,
      });

      expect(Number(result.value)).toBeGreaterThan(0);
    });

    it('should calculate fee of registerMultisignatureGroup tx', async () => {
      const transaction = {
        moduleAssetId: registerMultisignatureGroup,
        nonce: 1,
        fee: '1000000',
        amount: '10000000',
        numberOfSignatures: 2,
        senderPublicKey: 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f',
        mandatoryKeys: [accounts.genesis.summary.publicKey, accounts.delegate.summary.publicKey],
        optionalKeys: [accounts.delegate_candidate.summary.publicKey],
      };
      const result = await getTransactionFee({
        transaction,
        selectedPriority,
        numberOfSignatures: 2,
        network,
      });

      expect(Number(result.value)).toBeGreaterThan(0);
    });

    it('should calculate fee of multisignature token transfer tx', async () => {
      const transaction = {
        moduleAssetId: transfer,
        amount: '100000',
        nonce: '6',
        senderPublicKey: 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f',
      };
      const result = await getTransactionFee({
        transaction,
        selectedPriority,
        numberOfSignatures: 3,
        network,
      });

      expect(Number(result.value)).toBeGreaterThan(0);
    });

    it('should calculate fee of multisignature voteDelegate tx', async () => {
      const transaction = {
        moduleAssetId: voteDelegate,
        nonce: '6',
        senderPublicKey: 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f',
        votes: [
          { delegateAddress: accounts.genesis.summary.address, amount: '100000000' },
          { delegateAddress: accounts.delegate.summary.address, amount: '-100000000' },
        ],
      };
      const result = await getTransactionFee({
        transaction,
        selectedPriority,
        numberOfSignatures: 10,
        network,
      });

      expect(Number(result.value)).toBeGreaterThan(0);
    });

    it('should calculate fee of multisignature registerDelegate tx', async () => {
      const transaction = {
        moduleAssetId: registerDelegate,
        nonce: '6',
        senderPublicKey: 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f',
        username: 'user_name',
      };
      const result = await getTransactionFee({
        transaction,
        selectedPriority,
        numberOfSignatures: 64,
        network,
      });

      expect(Number(result.value)).toBeGreaterThan(0);
    });

    it('should calculate fee of multisignature unlockToken tx', async () => {
      const transaction = {
        moduleAssetId: unlockToken,
        nonce: '6',
        senderPublicKey: 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f',
        unlockObjects: [
          { delegateAddress: accounts.genesis.summary.address, amount: '-10000000', unvoteHeight: 1500 },
          { delegateAddress: accounts.delegate_candidate.summary.address, amount: '-340000000', unvoteHeight: 1500 },
        ],
      };
      const result = await getTransactionFee({
        transaction,
        selectedPriority,
        numberOfSignatures: 4,
        network,
      });

      expect(Number(result.value)).toBeGreaterThan(0);
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
