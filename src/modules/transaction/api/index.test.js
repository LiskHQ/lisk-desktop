/* eslint-disable max-lines */
import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import { getTotalSpendingAmount } from '@transaction/utils/transaction';
import { getState } from '@fixtures/transactions';
import http from 'src/utils/api/http';
import accounts from '@tests/constants/wallets';
import { fromTransactionJSON } from '@transaction/utils/encoding';
import { dryRun } from './index';

const { stake } = MODULE_COMMANDS_NAME_MAP;
const { network } = getState();
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
  const baseTx = {
    nonce: '6',
    senderPublicKey: 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f',
    signatures: [],
    fee: '0',
  };

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
