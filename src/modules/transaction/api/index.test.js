/* eslint-disable max-lines */
import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import { getTotalSpendingAmount, convertBinaryToString } from '@transaction/utils/transaction';
import { getState } from '@fixtures/transactions';
import http from 'src/utils/api/http';
import accounts from '@tests/constants/wallets';
import { fromTransactionJSON } from '@transaction/utils/encoding';
import { genKey, blsKey, pop } from '@tests/constants/keys';
import { mockCommandParametersSchemas } from 'src/modules/common/__fixtures__';
import { mockAppsTokens } from '@token/fungible/__fixtures__';
import { getTransactions, getTransactionStats, getTransactionFee, dryRun } from './index';

const { stake } = MODULE_COMMANDS_NAME_MAP;
const { network } = getState();
const mockToken = mockAppsTokens.data[0];
const encodedTransactionHex =
  '0a05746f6b656e12087472616e73666572180620002a20c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f32230a04040000001080c2d72f1a144662903af5e0c0662d9f1d43f087080c723096232200';
jest.mock('@liskhq/lisk-client', () => ({
  ...jest.requireActual('@liskhq/lisk-client'),
  transactions: {
    computeMinFee: jest.fn().mockReturnValue(10000000000n),
    getBytes: jest.fn().mockReturnValue(Buffer.from(encodedTransactionHex, 'hex')),
  },
}));

jest.mock('src/utils/api/http', () =>
  jest.fn().mockImplementation(() => Promise.resolve({ data: [{ type: 0 }] }))
);

jest.mock('src/utils/api/ws', () =>
  jest.fn().mockImplementation(() => Promise.resolve({ data: [{ type: 0 }] }))
);

describe('API: LSK Transactions', () => {
  const sampleId = 'sample_id';
  const moduleCommandSchemas = mockCommandParametersSchemas.data.commands.reduce(
    (result, { moduleCommand, schema }) => ({ ...result, [moduleCommand]: schema }),
    {}
  );
  const baseTx = {
    nonce: '6',
    senderPublicKey: 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f',
    signatures: [],
    fee: '0',
  };

  describe('getTransactions', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should call http with block id', async () => {
      await getTransactions({
        network,
        params: { blockId: sampleId },
      });

      expect(http).toHaveBeenCalledWith({
        path: '/api/v3/transactions',
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
        path: '/api/v3/transactions',
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
        path: '/api/v3/transactions',
        baseUrl: undefined,
        params: {},
      });
    });
  });

  describe('getTransactionStats', () => {
    it('Should call http with given params', () => {
      getTransactionStats({
        network,
        params: { period: 'week' },
      });

      expect(http).toHaveBeenCalledWith({
        path: '/api/v3/transactions/statistics/day',
        params: { limit: 7 },
        network,
      });
    });
  });

  describe('getTotalSpendingAmount', () => {
    it('should return amount of transfer in Beddows', () => {
      const tx = {
        module: 'token',
        command: 'transfer',
        params: { amount: '100000000' },
      };

      expect(getTotalSpendingAmount(tx)).toEqual(tx.params.amount);
    });

    it('should return amount of stakes in Beddows', () => {
      const tx = {
        title: stake,
        module: 'pos',
        command: 'stake',
        params: {
          stakes: [
            {
              validatorAddress: accounts.validator.summary.address,
              amount: '100000000',
            },
            {
              validatorAddress: accounts.validator.summary.address,
              amount: '100000000',
            },
          ],
        },
      };

      expect(getTotalSpendingAmount(tx)).toEqual('200000000');
    });
  });

  describe('getTransactionFee', () => {
    const selectedPriority = {
      value: 0,
      title: 'LOW',
    };

    it('should return fee in Beddows', async () => {
      const stakeTx = {
        module: 'pos',
        command: 'stake',
        params: {
          stakes: [
            { validatorAddress: accounts.genesis.summary.address, amount: '100000000' },
            { validatorAddress: accounts.validator.summary.address, amount: '-100000000' },
          ],
        },
      };
      const result = await getTransactionFee({
        transactionJSON: { ...baseTx, ...stakeTx },
        selectedPriority,
        network,
        moduleCommandSchemas,
        token: mockToken,
      });
      expect(Number(result.value)).toBeGreaterThan(0);
    });

    it('should calculate fee of stake tx', async () => {
      const stakeTx = {
        module: 'pos',
        command: 'stake',
        params: {
          stakes: [
            {
              validatorAddress: 'lskz5kf62627u2n8kzqa8jpycee64pgxzutcrbzhz',
              amount: 10,
            },
          ],
        },
      };

      const result = await getTransactionFee({
        transactionJSON: { ...baseTx, ...stakeTx },
        selectedPriority,
        network,
        moduleCommandSchemas,
        token: mockToken,
      });
      expect(Number(result.value)).toBeGreaterThan(0);
    });

    it('should calculate fee of register validator tx', async () => {
      const registerValidatorTx = {
        module: 'pos',
        command: 'registerValidator',
        params: {
          name: 'some_username',
          generatorKey: genKey,
          blsKey,
          proofOfPossession: pop,
        },
      };

      const result = await getTransactionFee({
        transactionJSON: { ...baseTx, ...registerValidatorTx },
        selectedPriority,
        network,
        moduleCommandSchemas,
        token: mockToken,
      });
      expect(Number(result.value)).toBeGreaterThan(0);
    });

    it('should calculate fee of reclaim tx', async () => {
      const reclaimTx = {
        module: 'legacy',
        command: 'reclaimLSK',
        params: {
          amount: '4454300000',
        },
      };
      const result = await getTransactionFee({
        transactionJSON: { ...baseTx, ...reclaimTx },
        selectedPriority,
        network,
        moduleCommandSchemas,
        token: mockToken,
      });

      expect(Number(result.value)).toBeGreaterThan(0);
    });

    it('should calculate fee of registerMultisignature tx', async () => {
      const regMultisigTx = {
        module: 'auth',
        command: 'registerMultisignature',
        params: {
          numberOfSignatures: 2,
          mandatoryKeys: [accounts.genesis.summary.publicKey, accounts.validator.summary.publicKey],
          optionalKeys: [accounts.validator_candidate.summary.publicKey],
          signatures: [],
        },
      };
      const result = await getTransactionFee({
        transactionJSON: { ...baseTx, ...regMultisigTx },
        selectedPriority,
        numberOfSignatures: 2,
        network,
        moduleCommandSchemas,
        token: mockToken,
      });

      expect(Number(result.value)).toBeGreaterThan(0);
    });

    it('should calculate fee of multisignature token transfer tx', async () => {
      const multisigTransferTx = {
        module: 'token',
        command: 'transfer',
        params: {
          amount: 100000,
          data: 'to test the instance',
          recipientAddress: 'lskz5kf62627u2n8kzqa8jpycee64pgxzutcrbzhz',
          tokenID: '00000000',
        },
      };
      const result = await getTransactionFee({
        transactionJSON: { ...baseTx, ...multisigTransferTx },
        selectedPriority,
        numberOfSignatures: 10,
        moduleCommandSchemas,
        token: mockToken,
      });

      expect(Number(result.value)).toBeGreaterThan(0);
    });

    it('should calculate fee of multisignature stake tx', async () => {
      const multisigStakeTx = {
        module: 'pos',
        command: 'stake',
        params: {
          stakes: [
            { validatorAddress: accounts.genesis.summary.address, amount: '100000000' },
            { validatorAddress: accounts.validator.summary.address, amount: '-100000000' },
          ],
        },
      };
      const result = await getTransactionFee({
        transactionJSON: { ...baseTx, ...multisigStakeTx },
        selectedPriority,
        numberOfSignatures: 10,
        moduleCommandSchemas,
        token: mockToken,
      });

      expect(Number(result.value)).toBeGreaterThan(0);
    });

    it('should calculate fee of multisignature registerValidator tx', async () => {
      const multisigRegisterValidatorTx = {
        module: 'pos',
        command: 'registerValidator',
        params: {
          name: 'user_name',
          generatorKey: convertBinaryToString(genKey),
          blsKey: convertBinaryToString(blsKey),
          proofOfPossession: convertBinaryToString(pop),
        },
      };
      const result = await getTransactionFee({
        transactionJSON: { ...baseTx, ...multisigRegisterValidatorTx },
        selectedPriority,
        numberOfSignatures: 64,
        network,
        moduleCommandSchemas,
        token: mockToken,
      });

      expect(Number(result.value)).toBeGreaterThan(0);
    });

    it.skip('should calculate fee of multisignature unlock tx', async () => {
      const multisigUnlockTx = {
        module: 'pos',
        command: 'unlock',
      };
      const result = await getTransactionFee({
        transactionJSON: { ...baseTx, ...multisigUnlockTx },
        selectedPriority,
        numberOfSignatures: 4,
        network,
        moduleCommandSchemas,
        token: mockToken,
      });

      expect(Number(result.value)).toBeGreaterThan(0);
    });
  });

  describe('dryRun', () => {
    const serviceUrl = 'http://localhost:4000';
    it('should return error if transaction is invalid', async () => {
      const transactionJSON = {
        ...baseTx,
        module: 'token',
        command: 'transfer',
        params: {
          tokenID: '04000000',
          amount: '100000000',
          recipientAddress: 'lsk3ay4z7wqjczbo5ogcqxgxx23xyacxmycwxfh4d',
          data: '',
        },
      };
      const paramsSchema = network.networks.LSK.moduleCommandSchemas['token:transfer'];
      const transaction = fromTransactionJSON(transactionJSON, paramsSchema);
      await dryRun({
        transaction,
        serviceUrl,
        paramsSchema,
      });

      expect(http).toHaveBeenCalledWith({
        baseUrl: serviceUrl,
        method: 'POST',
        path: '/api/v3/transactions/dryrun',
        data: {
          transaction: encodedTransactionHex,
          skipVerify: false,
        },
      });
    });
  });
});
