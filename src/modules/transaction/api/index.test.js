/* eslint-disable max-lines */
import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import {
  getTxAmount,
  convertStringToBinary,
  convertBinaryToString,
} from '@transaction/utils/transaction';
import { getState } from '@fixtures/transactions';
import * as delegates from '@dpos/validator/api';
import http from 'src/utils/api/http';
import accounts from '@tests/constants/wallets';
import { genKey, blsKey, pop } from '@tests/constants/keys';
import {
  getTransaction,
  getTransactions,
  getTransactionStats,
  getSchemas,
  getTransactionFee, getRegisteredDelegates,
} from './index';

const {
  transfer, voteDelegate, registerDelegate, registerMultisignatureGroup, unlock, reclaim,
} = MODULE_COMMANDS_NAME_MAP;
const { network } = getState();

jest.mock('src/utils/api/http', () =>
  jest.fn().mockImplementation(() => Promise.resolve({ data: [{ type: 0 }] })));

jest.mock('src/utils/api/ws', () =>
  jest.fn().mockImplementation(() => Promise.resolve({ data: [{ type: 0 }] })));

jest.mock('@dpos/validator/api', () => ({
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
        moduleCommand: transfer,
        params: { amount: 100000000 },
      };

      expect(getTxAmount(tx)).toEqual(tx.params.amount);
    });

    it('should return amount of votes in Beddows', () => {
      const tx = {
        title: voteDelegate,
        moduleCommand: voteDelegate,
        params: {
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
        title: unlock,
        moduleCommand: unlock,
        params: {
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
    const baseTx = {
      nonce: '6',
      sender: { publicKey: 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f' },
    };
    const selectedPriority = {
      value: 0,
      title: 'LOW',
    };

    it('should return fee in Beddows', async () => {
      const transferTx = {
        params: {
          amount: '100000000',
          data: 'to test the instance',
          recipient: { address: 'lskz5kf62627u2n8kzqa8jpycee64pgxzutcrbzhz' },
        },
        moduleCommand: transfer,
      };
      const result = await getTransactionFee({
        transaction: { ...baseTx, ...transferTx },
        selectedPriority,
        network,
      });
      expect(Number(result.value)).toBeGreaterThan(0);
    });

    it('should calculate fee of vote tx', async () => {
      const voteTx = {
        moduleCommand: voteDelegate,
        params: {
          votes: [],
        },
      };

      const result = await getTransactionFee({
        transaction: { ...baseTx, ...voteTx },
        selectedPriority,
        network,
      });
      expect(Number(result.value)).toBeGreaterThan(0);
    });

    it('should calculate fee of register delegate tx', async () => {
      const registerDelegateTx = {
        moduleCommand: registerDelegate,
        params: {
          username: 'some_username',
          generatorKey: convertStringToBinary(genKey),
          blsKey: convertStringToBinary(blsKey),
          proofOfPossession: convertStringToBinary(pop),
        },
      };

      const result = await getTransactionFee({
        transaction: { ...baseTx, ...registerDelegateTx },
        selectedPriority,
        network,
      });
      expect(Number(result.value)).toBeGreaterThan(0);
    });

    it('should calculate fee of reclaim tx', async () => {
      const reclaimTx = {
        moduleCommand: reclaim,
        params: {
          amount: '4454300000',
        },
      };
      const result = await getTransactionFee({
        transaction: { ...baseTx, ...reclaimTx },
        selectedPriority,
        network,
      });

      expect(Number(result.value)).toBeGreaterThan(0);
    });

    it('should calculate fee of registerMultisignatureGroup tx', async () => {
      const regMultisigTx = {
        moduleCommand: registerMultisignatureGroup,
        params: {
          numberOfSignatures: 2,
          mandatoryKeys: [accounts.genesis.summary.publicKey, accounts.delegate.summary.publicKey],
          optionalKeys: [accounts.delegate_candidate.summary.publicKey],
        },
      };
      const result = await getTransactionFee({
        transaction: { ...baseTx, ...regMultisigTx },
        selectedPriority,
        numberOfSignatures: 2,
        network,
      });

      expect(Number(result.value)).toBeGreaterThan(0);
    });

    it('should calculate fee of multisignature token transfer tx', async () => {
      const multisigTransferTx = {
        moduleCommand: transfer,
        params: {
          amount: '100000',
          data: 'to test the instance',
          recipient: { address: 'lskz5kf62627u2n8kzqa8jpycee64pgxzutcrbzhz' },
        },
      };
      const result = await getTransactionFee({
        transaction: { ...baseTx, ...multisigTransferTx },
        selectedPriority,
        numberOfSignatures: 3,
        network,
      });

      expect(Number(result.value)).toBeGreaterThan(0);
    });

    it('should calculate fee of multisignature voteDelegate tx', async () => {
      const multisigVoteTx = {
        moduleCommand: voteDelegate,
        params: {
          votes: [
            { delegateAddress: accounts.genesis.summary.address, amount: '100000000' },
            { delegateAddress: accounts.delegate.summary.address, amount: '-100000000' },
          ],
        },
      };
      const result = await getTransactionFee({
        transaction: { ...baseTx, ...multisigVoteTx },
        selectedPriority,
        numberOfSignatures: 10,
        network,
      });

      expect(Number(result.value)).toBeGreaterThan(0);
    });

    it('should calculate fee of multisignature registerDelegate tx', async () => {
      const multisigRegisterDelegateTx = {
        moduleCommand: registerDelegate,
        params: {
          username: 'user_name',
          generatorKey: convertBinaryToString(genKey),
          blsKey: convertBinaryToString(blsKey),
          proofOfPossession: convertBinaryToString(pop),
        },
      };
      const result = await getTransactionFee({
        transaction: { ...baseTx, ...multisigRegisterDelegateTx },
        selectedPriority,
        numberOfSignatures: 64,
        network,
      });

      expect(Number(result.value)).toBeGreaterThan(0);
    });

    it('should calculate fee of multisignature unlock tx', async () => {
      const multisigUnlockTx = {
        moduleCommand: unlock,
        params: {
          unlockObjects: [
            { delegateAddress: accounts.genesis.summary.address, amount: '-10000000', unvoteHeight: 1500 },
            { delegateAddress: accounts.delegate_candidate.summary.address, amount: '-340000000', unvoteHeight: 1500 },
          ],
        },
      };
      const result = await getTransactionFee({
        transaction: { ...baseTx, ...multisigUnlockTx },
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
