/* eslint-disable max-lines */
import { MODULE_ASSETS_NAME_ID_MAP, moduleAssetSchemas } from '@constants';
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
import accounts from '../../../../test/constants/accounts';

const {
  transfer, voteDelegate, registerDelegate, registerMultisignatureGroup, unlockToken, reclaimLSK,
} = MODULE_ASSETS_NAME_ID_MAP;

jest.mock('../http', () =>
  jest.fn().mockImplementation(() => Promise.resolve({ data: [{ type: 0 }] })));

jest.mock('../ws', () =>
  jest.fn().mockImplementation(() => Promise.resolve({ data: [{ type: 0 }] })));

jest.mock('../delegate', () => ({
  getDelegates: jest.fn(),
}));

describe('API: LSK Transactions', () => {
  const network = {
    serviceUrl: 'http://sample.com/',
    networks: {
      LSK: {
        moduleAssets: [
          { id: '2:0', name: 'token:transfer' },
          { id: '4:0', name: 'keys:registerMultisignatureGroup' },
          { id: '5:0', name: 'dpos:registerDelegate' },
          { id: '5:1', name: 'dpos:voteDelegate' },
          { id: '5:2', name: 'dpos:unlockToken' },
          { id: '5:3', name: 'dpos:reportDelegateMisbehavior' },
          { id: '1000:0', name: 'legacyAccount:reclaimLSK' },
        ],
      },
    },
  };
  const baseUrl = 'http://custom-basse-url.com/';
  const sampleId = 'sample_id';

  moduleAssetSchemas['2:0'] = {
    $id: 'lisk/transfer-asset',
    properties: {
      amount: { dataType: 'uint64', fieldNumber: 1 },
      recipientAddress: {
        dataType: 'bytes', fieldNumber: 2, maxLength: 20, minLength: 20,
      },
      data: {
        dataType: 'string', fieldNumber: 3, maxLength: 64, minLength: 0,
      },
    },
    required: ['amount', 'recipientAddress', 'data'],
    title: 'Transfer transaction asset',
    type: 'object',
  };

  moduleAssetSchemas['5:0'] = {
    $id: 'lisk/dpos/register',
    type: 'object',
    required: [
      'username',
    ],
    properties: {
      username: {
        dataType: 'string',
        fieldNumber: 1,
        minLength: 1,
        maxLength: 20,
      },
    },
  };

  moduleAssetSchemas['5:1'] = {
    $id: 'lisk/dpos/vote',
    type: 'object',
    required: [
      'votes',
    ],
    properties: {
      votes: {
        type: 'array',
        minItems: 1,
        maxItems: 20,
        items: {
          type: 'object',
          required: [
            'delegateAddress',
            'amount',
          ],
          properties: {
            delegateAddress: {
              dataType: 'bytes',
              fieldNumber: 1,
              minLength: 20,
              maxLength: 20,
            },
            amount: {
              dataType: 'sint64',
              fieldNumber: 2,
            },
          },
        },
        fieldNumber: 1,
      },
    },
  };

  moduleAssetSchemas['5:2'] = {
    $id: 'lisk/dpos/unlock',
    type: 'object',
    required: [
      'unlockObjects',
    ],
    properties: {
      unlockObjects: {
        type: 'array',
        minItems: 1,
        maxItems: 20,
        items: {
          type: 'object',
          required: [
            'delegateAddress',
            'amount',
            'unvoteHeight',
          ],
          properties: {
            delegateAddress: {
              dataType: 'bytes',
              fieldNumber: 1,
              minLength: 20,
              maxLength: 20,
            },
            amount: {
              dataType: 'uint64',
              fieldNumber: 2,
            },
            unvoteHeight: {
              dataType: 'uint32',
              fieldNumber: 3,
            },
          },
        },
        fieldNumber: 1,
      },
    },
  };

  moduleAssetSchemas['4:0'] = {
    $id: 'lisk/keys/register',
    type: 'object',
    required: [
      'numberOfSignatures',
      'optionalKeys',
      'mandatoryKeys',
    ],
    properties: {
      numberOfSignatures: {
        dataType: 'uint32',
        fieldNumber: 1,
        minimum: 1,
        maximum: 64,
      },
      mandatoryKeys: {
        type: 'array',
        items: {
          dataType: 'bytes',
          minLength: 32,
          maxLength: 32,
        },
        fieldNumber: 2,
        minItems: 0,
        maxItems: 64,
      },
      optionalKeys: {
        type: 'array',
        items: {
          dataType: 'bytes',
          minLength: 32,
          maxLength: 32,
        },
        fieldNumber: 3,
        minItems: 0,
        maxItems: 64,
      },
    },
  };

  moduleAssetSchemas['1000:0'] = {
    $id: 'lisk/legacyAccount/reclaim',
    title: 'Reclaim transaction asset',
    type: 'object',
    required: [
      'amount',
    ],
    properties: {
      amount: {
        dataType: 'uint64',
        fieldNumber: 1,
      },
    },
  };

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
      moduleAssetId: transfer,
    };
    const selectedPriority = {
      value: 0,
      title: 'LOW',
    };
    it('should return fee in Beddows', async () => {
      const result = await getTransactionFee({
        transaction: txData, selectedPriority,
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
      });

      expect(Number(result.value)).toBeGreaterThan(0);
    });

    it('should calculate fee of multisignature unlockToken tx', async () => {
      const transaction = {
        moduleAssetId: unlockToken,
        nonce: '6',
        senderPublicKey: 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f',
        unlockingObjects: [
          { delegateAddress: accounts.genesis.summary.address, amount: '-10000000' },
          { delegateAddress: accounts.delegate_candidate.summary.address, amount: '-340000000' },
        ],
      };
      const result = await getTransactionFee({
        transaction,
        selectedPriority,
        numberOfSignatures: 4,
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
