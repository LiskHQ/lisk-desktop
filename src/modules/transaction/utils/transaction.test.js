/* eslint-disable max-lines */
import { cryptography } from '@liskhq/lisk-client';
import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import { splitModuleAndCommand } from 'src/modules/transaction/utils/moduleCommand';
import { getBase32AddressFromAddress } from '@wallet/utils/account';
import accounts from '@tests/constants/wallets';
import { genKey, blsKey, pop } from '@tests/constants/keys';
// import moduleCommandSchemas from '@tests/constants/schemas';
import { mockAppTokens } from '@tests/fixtures/token';
import { mockCommandParametersSchemas } from 'src/modules/common/__fixtures__';
import {
  getTxAmount,
  containsTransactionType,
  transactionToJSON,
  removeExcessSignatures,
  convertStringToBinary,
  normalizeTransactionsStatisticsParams,
  normalizeNumberRange,
} from './transaction';
import { fromTransactionJSON } from './encoding';

const address = 'lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt';
jest.spyOn(cryptography.address, 'getLisk32AddressFromPublicKey').mockReturnValue(address);

const { transfer, stakeValidator, registerMultisignature, registerValidator, reclaimLSK, unlock } =
  MODULE_COMMANDS_NAME_MAP;

// TODO: All of these tests need to be rewritten to adopt to new transaction schema https://github.com/LiskHQ/lisk-sdk/blob/7e71617d281649a6942434f729a815870aac2394/elements/lisk-transactions/src/schema.ts#L15
// We need to avoid lot of back and forth convertion from JSON and JS object
// For consistency we will adopt these changes similar to https://github.com/LiskHQ/lisk-sdk/blob/development/elements/lisk-api-client/src/transaction.ts
// We will address of these problem in issue https://github.com/LiskHQ/lisk-desktop/issues/4400

describe.skip('API: LSK Transactions', () => {
  const baseDesktopTx = {
    senderPublicKey: accounts.genesis.summary.publicKey,
    nonce: accounts.genesis.sequence.nonce,
    fee: '1000000',
    signatures: [],
  };
  const baseElementsTx = {
    senderPublicKey: convertStringToBinary(accounts.genesis.summary.publicKey),
    nonce: BigInt(accounts.genesis.sequence.nonce),
    fee: BigInt(1000000),
    signatures: [],
  };

  const moduleCommandSchemas = mockCommandParametersSchemas.data.reduce(
    (result, { moduleCommand, schema }) => ({ ...result, [moduleCommand]: schema }),
    {}
  );
  describe('getTxAmount', () => {
    it('should return amount of transfer in Beddows', () => {
      const tx = {
        module: 'token',
        command: 'transfer',
        params: { amount: 100000000 },
      };

      expect(getTxAmount(tx)).toEqual(tx.params.amount);
    });

    it('should return amount of stakes in Beddows', () => {
      const tx = {
        title: stakeValidator,
        module: 'pos',
        command: 'stakeValidator',
        params: {
          stakes: [
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
        module: 'pos',
        command: 'unlock',
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

  describe('fromTransactionJSON', () => {
    it('creates a transaction object for transfer transaction', () => {
      const tx = {
        ...baseDesktopTx,
        module: 'token',
        command: 'transfer',
        params: {
          recipientAddress: accounts.validator.summary.address,
          amount: 100000000,
          data: 'test',
          tokenID: '00000000',
        },
      };
      const txObj = fromTransactionJSON(tx, moduleCommandSchemas['token:transfer']);
      const [module, command] = splitModuleAndCommand(transfer);
      expect(txObj).toEqual({
        ...baseElementsTx,
        module,
        command,
        id: Buffer.alloc(0),
        params: {
          recipientAddress: Buffer.alloc(0),
          amount: BigInt(100000000),
          data: 'test',
          tokenID: expect.arrayContaining([]),
        },
      });
    });

    it('creates a transaction object for stake transaction', () => {
      const tx = {
        ...baseDesktopTx,
        module: 'pos',
        command: 'stakeValidator',
        params: {
          stakes: [
            {
              amount: '100',
              validatorAddress: accounts.genesis.summary.address,
            },
            {
              amount: '-100',
              validatorAddress: accounts.validator.summary.address,
            },
          ],
        },
      };
      const txObj = fromTransactionJSON(tx, moduleCommandSchemas['pos:stake']);
      const [module, command] = splitModuleAndCommand(stakeValidator);
      expect(txObj).toEqual({
        ...baseElementsTx,
        module,
        command,
        id: Buffer.alloc(0),
        params: {
          stakes: tx.params.stakes.map((item) => ({
            amount: BigInt(item.amount),
            validatorAddress: expect.arrayContaining([]),
          })),
        },
      });
    });

    it('creates a transaction object for validator registration transaction', () => {
      const tx = {
        ...baseDesktopTx,
        module: 'pos',
        command: 'registerValidator',
        params: {
          name: 'username',
          generatorKey: genKey,
          blsKey,
          proofOfPossession: pop,
        },
      };
      const txObj = fromTransactionJSON(tx, moduleCommandSchemas['pos:registerValidator']);
      const [module, command] = splitModuleAndCommand(registerValidator);
      expect(txObj).toEqual({
        ...baseElementsTx,
        id: Buffer.alloc(0),
        module,
        command,
        params: {
          name: 'username',
          generatorKey: expect.arrayContaining([]),
          blsKey: expect.arrayContaining([]),
          proofOfPossession: expect.arrayContaining([]),
        },
      });
    });

    it('creates a transaction object for reclaimLSK transaction', () => {
      const tx = {
        ...baseDesktopTx,
        module: 'legacy',
        command: 'reclaim',
        params: {
          amount: '10000000',
        },
      };
      const txObj = fromTransactionJSON(tx, moduleCommandSchemas['legacy:reclaimLSK']);
      const [module, command] = splitModuleAndCommand(reclaimLSK);
      expect(txObj).toEqual({
        ...baseElementsTx,
        id: Buffer.alloc(0),
        module,
        command,
        params: {
          amount: BigInt('10000000'),
        },
      });
    });

    it('creates a transaction object for unlockToken transaction', () => {
      const tx = {
        ...baseDesktopTx,
        module: 'pos',
        command: 'unlock',
      };
      const txObj = fromTransactionJSON(tx, moduleCommandSchemas['pos:unlock']);
      const [module, command] = splitModuleAndCommand(unlock);
      expect(txObj).toEqual({
        ...baseElementsTx,
        id: Buffer.alloc(0),
        module,
        command,
        params: {},
      });
    });

    it('creates a transaction object for registerMultisignature transaction', () => {
      const tx = {
        ...baseDesktopTx,
        module: 'auth',
        command: 'registerMultisignature',
        params: {
          numberOfSignatures: 2,
          mandatoryKeys: [accounts.genesis.summary.publicKey, accounts.validator.summary.publicKey],
          optionalKeys: [accounts.validator_candidate.summary.publicKey],
          signatures: [],
        },
      };
      const txObj = fromTransactionJSON(tx, moduleCommandSchemas['auth:registerMultisignature']);
      const [module, command] = splitModuleAndCommand(registerMultisignature);
      expect(txObj).toEqual({
        ...baseElementsTx,
        module,
        command,
        id: Buffer.alloc(0),
        params: {
          numberOfSignatures: 2,
          mandatoryKeys: tx.params.mandatoryKeys.map(() => expect.arrayContaining([])),
          optionalKeys: tx.params.optionalKeys.map(() => expect.arrayContaining([])),
          signatures: [],
        },
      });
    });
  });

  // describe('elementTxToDesktopTx', () => {
  //   it('should a transfer transaction with type signature of lisk service', () => {
  //     const [module, command] = splitModuleAndCommand(transfer);
  //     const tx = {
  //       ...baseElementsTx,
  //       module,
  //       command,
  //       params: {
  //         amount: BigInt(100000000),
  //         recipientAddress: getAddressFromBase32Address(accounts.validator.summary.address),
  //         data: '',
  //         tokenID: mockAppTokens[0].tokenID,
  //       },
  //     };

  //     expect(elementTxToDesktopTx(tx)).toEqual({
  //       ...baseDesktopTx,
  //       moduleCommand: transfer,
  //       id: '',
  //       params: {
  //         amount: '100000000',
  //         recipient: { address: accounts.validator.summary.address },
  //         data: '',
  //         token: { tokenID: mockAppTokens[0].tokenID },
  //       },
  //     });
  //   });

  //   it('should a register validator transaction with type signature of lisk service', () => {
  //     const [module, command] = splitModuleAndCommand(registerValidator);
  //     const tx = {
  //       ...baseElementsTx,
  //       module,
  //       command,
  //       params: {
  //         name: 'super_validator',
  //         generatorKey: convertStringToBinary(genKey),
  //         blsKey: convertStringToBinary(blsKey),
  //         proofOfPossession: convertStringToBinary(pop),
  //       },
  //     };

  //     expect(elementTxToDesktopTx(tx)).toEqual({
  //       ...baseDesktopTx,
  //       moduleCommand: registerValidator,
  //       id: '',
  //       params: {
  //         name: 'super_validator',
  //         generatorKey: genKey,
  //         blsKey,
  //         proofOfPossession: pop,
  //       },
  //     });
  //   });

  //   it('should a stake validator transaction with type signature of lisk service', () => {
  //     const [module, command] = splitModuleAndCommand(stakeValidator);
  //     const tx = {
  //       ...baseElementsTx,
  //       module,
  //       command,
  //       params: {
  //         stakes: [
  //           {
  //             amount: BigInt('100'),
  //             validatorAddress: getAddressFromBase32Address(accounts.validator.summary.address),
  //           },
  //         ],
  //       },
  //     };

  //     expect(elementTxToDesktopTx(tx)).toEqual({
  //       ...baseDesktopTx,
  //       moduleCommand: stakeValidator,
  //       id: '',
  //       params: {
  //         stakes: [
  //           {
  //             amount: '100',
  //             validatorAddress: accounts.validator.summary.address,
  //           },
  //         ],
  //       },
  //     });
  //   });

  //   it('should transform a reclaimLSK transaction', () => {
  //     const [module, command] = splitModuleAndCommand(reclaim);
  //     const tx = {
  //       ...baseElementsTx,
  //       module,
  //       command,
  //       params: {
  //         amount: BigInt(100),
  //       },
  //     };

  //     expect(elementTxToDesktopTx(tx)).toEqual({
  //       ...baseDesktopTx,
  //       moduleCommand: reclaim,
  //       id: '',
  //       params: {
  //         amount: '100',
  //       },
  //     });
  //   });

  //   it('should transform a unlockToken transaction', () => {
  //     const [module, command] = splitModuleAndCommand(unlock);
  //     const unlockObjects = [
  //       {
  //         validatorAddress:
  //           getAddressFromBase32Address(accounts.validator.summary.address),
  //         amount: BigInt('10000000'),
  //         unstakeHeight: 1000000,
  //       },
  //       {
  //         validatorAddress:
  //           getAddressFromBase32Address(accounts.send_all_wallet.summary.address),
  //         amount: BigInt('-10000000'),
  //         unstakeHeight: 1000000,
  //       },
  //     ];

  //     const tx = {
  //       ...baseElementsTx,
  //       module,
  //       command,
  //       params: { unlockObjects },
  //     };

  //     expect(elementTxToDesktopTx(tx)).toEqual({
  //       ...baseDesktopTx,
  //       moduleCommand: unlock,
  //       id: '',
  //       params: {
  //         unlockObjects: tx.params.unlockObjects.map(item => ({
  //           amount: String(item.amount),
  //           validatorAddress: getBase32AddressFromAddress(item.validatorAddress),
  //           unstakeHeight: item.unstakeHeight,
  //         })),
  //       },
  //     });
  //   });

  //   it('should transform a registerMultisignature transaction', () => {
  //     const [module, command] = splitModuleAndCommand(registerMultisignature);
  //     const mandatoryKeys = [
  //       accounts.genesis.summary.publicKey,
  //       accounts.validator.summary.publicKey,
  //     ].map(key => convertStringToBinary(key));
  //     const optionalKeys = [
  //       accounts.validator_candidate.summary.publicKey,
  //     ].map(key => convertStringToBinary(key));

  //     const tx = {
  //       ...baseElementsTx,
  //       module,
  //       command,
  //       params: {
  //         numberOfSignatures: 2,
  //         mandatoryKeys,
  //         optionalKeys,
  //         signatures: [],
  //       },
  //     };

  //     expect(elementTxToDesktopTx(tx)).toEqual({
  //       ...baseDesktopTx,
  //       moduleCommand: registerMultisignature,
  //       id: '',
  //       params: {
  //         numberOfSignatures: 2,
  //         mandatoryKeys: [
  //           accounts.genesis.summary.publicKey,
  //           accounts.validator.summary.publicKey,
  //         ],
  //         optionalKeys: [
  //           accounts.validator_candidate.summary.publicKey,
  //         ],
  //         signatures: [],
  //       },
  //     });
  //   });
  // });

  describe('containsTransactionType', () => {
    it('should return true', () => {
      let pending = [{ moduleCommand: stakeValidator }];
      expect(containsTransactionType(pending, stakeValidator)).toEqual(true);

      pending = [{ moduleCommand: transfer }, { moduleCommand: stakeValidator }];
      expect(containsTransactionType(pending, stakeValidator)).toEqual(true);
    });

    it('should return false', () => {
      let pending = [];
      expect(containsTransactionType(pending, stakeValidator)).toEqual(false);

      pending = [{ moduleCommand: transfer }];
      expect(containsTransactionType(pending, stakeValidator)).toEqual(false);
    });
  });

  describe('transactionToJSON', () => {
    beforeEach(() => {
      // eslint-disable-next-line no-extend-native
      BigInt.prototype.toJSON = function () {
        return `${this.toString()}n`;
      };
    });

    afterEach(() => {
      // eslint-disable-next-line no-extend-native
      BigInt.prototype.toJSON = undefined;
    });
    const transaction = {
      ...baseElementsTx,
      module: 2,
      command: 0,
      params: {
        amount: BigInt(10000),
        recipientAddress: getBase32AddressFromAddress(accounts.validator.summary.address),
        data: '',
        tokenID: mockAppTokens[0].tokenID,
      },
    };
    it('should return the transaction as JSON', () => {
      expect(JSON.parse(transactionToJSON(transaction))).toEqual({
        senderPublicKey: accounts.genesis.summary.publicKey,
        nonce: '1n',
        fee: '1000000n',
        signatures: [],
        module: 2,
        command: 0,
        params: {
          amount: '10000n',
          recipientAddress: expect.stringContaining('lsk'),
          data: '',
          tokenID: mockAppTokens[0].tokenID,
        },
      });
    });
  });

  describe('removeExcessSignatures', () => {
    it('should remove optional signature considering the sender signature', () => {
      const nonEmpty = convertStringToBinary(accounts.genesis.summary.publicKey);
      const empty = convertStringToBinary('');
      const mandatoryKeysNo = 2;
      const hasSenderSignature = true;
      const signatures = [nonEmpty, nonEmpty, empty, nonEmpty];
      const expectSignatures = [nonEmpty, nonEmpty, empty, empty];
      expect(removeExcessSignatures(signatures, mandatoryKeysNo, hasSenderSignature)).toEqual(
        expectSignatures
      );
    });
  });

  describe('normalizeTransactionsStatisticsParams', () => {
    it('returns expected API params', () => {
      let expectedResult = { interval: 'day', limit: 7 };
      expect(normalizeTransactionsStatisticsParams('week')).toEqual(expectedResult);
      expectedResult = { interval: 'month', limit: 6 };
      expect(normalizeTransactionsStatisticsParams('month')).toEqual(expectedResult);
      expectedResult = { interval: 'month', limit: 12 };
      expect(normalizeTransactionsStatisticsParams('year')).toEqual(expectedResult);
    });
  });

  describe('normalizeNumberRange', () => {
    it('returns distribution data by amount', () => {
      const distributionData = {
        '1_10': 1705,
        '10_100': 371,
        '100_1000': 287,
        '1000_10000': 180,
        '10000_100000': 53,
        '100000_1000000': 5,
        '0.1_1': 2258,
        '0.01_0.1': 697,
        '0.001_0.01': 306,
      };
      const expectedResult = {
        '0 - 10 LSK': 4966,
        '11 - 100 LSK': 371,
        '101 - 1000 LSK': 287,
        '1001 - 10,000 LSK': 180,
        '10,001 - 100,000 LSK': 53,
        '100,001 - 1,000,000 LSK': 5,
      };
      expect(normalizeNumberRange(distributionData)).toEqual(expectedResult);
    });
  });
});
