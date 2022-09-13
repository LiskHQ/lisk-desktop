/* eslint-disable max-lines */
import { cryptography } from '@liskhq/lisk-client';
import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import { splitModuleAndCommand } from 'src/modules/transaction/utils/moduleCommand';
import {
  getAddressFromBase32Address,
  getBase32AddressFromAddress,
} from '@wallet/utils/account';
import accounts from '@tests/constants/wallets';
import { genKey, blsKey, pop } from '@tests/constants/keys';
import {
  getTxAmount,
  elementTxToDesktopTx,
  containsTransactionType,
  desktopTxToElementsTx,
  transactionToJSON,
  removeExcessSignatures,
  convertStringToBinary,
} from './transaction';

const address = 'lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt';
jest.spyOn(cryptography.address, 'getLisk32AddressFromPublicKey').mockReturnValue(address);

const {
  transfer, voteDelegate, registerMultisignatureGroup, registerDelegate, reclaim, unlock,
} = MODULE_COMMANDS_NAME_MAP;

// TODO: All of these tests need to be rewritten to adopt to new transaction schema https://github.com/LiskHQ/lisk-sdk/blob/7e71617d281649a6942434f729a815870aac2394/elements/lisk-transactions/src/schema.ts#L15
// We need to avoid lot of back and forth convertion from JSON and JS object
// For consistency we will adopt these changes similar to https://github.com/LiskHQ/lisk-sdk/blob/development/elements/lisk-api-client/src/transaction.ts
// We will address of these problem in issue https://github.com/LiskHQ/lisk-desktop/issues/4400

describe('API: LSK Transactions', () => {
  const baseDesktopTx = {
    sender: {
      publicKey: accounts.genesis.summary.publicKey,
      address: accounts.genesis.summary.address,
    },
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

  describe('desktopTxToElementsTx', () => {
    it('creates a transaction object for transfer transaction', () => {
      const tx = {
        ...baseDesktopTx,
        moduleCommand: transfer,
        params: {
          recipient: { address: accounts.delegate.summary.address },
          amount: 100000000,
          data: 'test',
        },
      };
      const txObj = desktopTxToElementsTx(tx, transfer);
      const [module, command] = splitModuleAndCommand(transfer);
      expect(txObj).toEqual({
        ...baseElementsTx,
        module,
        command,
        params: {
          recipientAddress: expect.arrayContaining([]),
          amount: BigInt(100000000),
          data: 'test',
        },
      });
    });

    it('creates a transaction object for vote transaction', () => {
      const tx = {
        ...baseDesktopTx,
        moduleCommand: voteDelegate,
        params: {
          votes: [
            {
              amount: '100',
              delegateAddress: accounts.genesis.summary.address,
            },
            {
              amount: '-100',
              delegateAddress: accounts.delegate.summary.address,
            },
          ],
        },
      };
      const txObj = desktopTxToElementsTx(tx, voteDelegate);
      const [module, command] = splitModuleAndCommand(voteDelegate);
      expect(txObj).toEqual({
        ...baseElementsTx,
        module,
        command,
        params: {
          votes: tx.params.votes.map(item => ({
            amount: BigInt(item.amount),
            delegateAddress: expect.arrayContaining([]),
          })),
        },
      });
    });

    it('creates a transaction object for delegate registration transaction', () => {
      const tx = {
        ...baseDesktopTx,
        moduleCommand: registerDelegate,
        params: {
          username: 'username',
          generatorPublicKey: genKey,
          blsPublicKey: blsKey,
          proofOfPossession: pop,
        },
      };
      const txObj = desktopTxToElementsTx(tx, registerDelegate);
      const [module, command] = splitModuleAndCommand(registerDelegate);
      expect(txObj).toEqual({
        ...baseElementsTx,
        module,
        command,
        params: {
          username: 'username',
          generatorPublicKey: convertStringToBinary(genKey),
          blsPublicKey: convertStringToBinary(blsKey),
          proofOfPossession: convertStringToBinary(pop),
        },
      });
    });

    it('creates a transaction object for reclaimLSK transaction', () => {
      const tx = {
        ...baseDesktopTx,
        moduleCommand: reclaim,
        params: {
          amount: '10000000',
        },
      };
      const txObj = desktopTxToElementsTx(tx, reclaim);
      const [module, command] = splitModuleAndCommand(reclaim);
      expect(txObj).toEqual({
        ...baseElementsTx,
        module,
        command,
        params: {
          amount: BigInt('10000000'),
        },
      });
    });

    it('creates a transaction object for unlockToken transaction', () => {
      const unlockObjects = [
        { delegateAddress: accounts.genesis.summary.address, amount: '-1000' },
        { delegateAddress: accounts.delegate.summary.address, amount: '1000' },
      ];
      const tx = {
        ...baseDesktopTx,
        moduleCommand: unlock,
        params: {
          unlockObjects,
        },
      };
      const txObj = desktopTxToElementsTx(tx, unlock);
      const [module, command] = splitModuleAndCommand(unlock);
      expect(txObj).toEqual({
        ...baseElementsTx,
        module,
        command,
        params: {
          unlockObjects: tx.params.unlockObjects.map(item => ({
            amount: BigInt(item.amount),
            delegateAddress: expect.arrayContaining([]),
          })),
        },
      });
    });

    it('creates a transaction object for registerMultisignatureGroup transaction', () => {
      const tx = {
        ...baseDesktopTx,
        moduleCommand: registerMultisignatureGroup,
        params: {
          numberOfSignatures: 2,
          mandatoryKeys: [accounts.genesis.summary.publicKey, accounts.delegate.summary.publicKey],
          optionalKeys: [accounts.delegate_candidate.summary.publicKey],
        },
      };
      const txObj = desktopTxToElementsTx(tx, registerMultisignatureGroup);
      const [module, command] = splitModuleAndCommand(registerMultisignatureGroup);
      expect(txObj).toEqual({
        ...baseElementsTx,
        module,
        command,
        params: {
          numberOfSignatures: 2,
          mandatoryKeys: tx.params.mandatoryKeys.map(() => expect.arrayContaining([])),
          optionalKeys: tx.params.optionalKeys.map(() => expect.arrayContaining([])),
        },
      });
    });
  });

  describe('elementTxToDesktopTx', () => {
    it('should a transfer transaction with type signature of lisk service', () => {
      const [module, command] = splitModuleAndCommand(transfer);
      const tx = {
        ...baseElementsTx,
        module,
        command,
        params: {
          amount: BigInt(100000000),
          recipientAddress: getAddressFromBase32Address(accounts.delegate.summary.address),
          data: '',
        },
      };

      expect(elementTxToDesktopTx(tx)).toEqual({
        ...baseDesktopTx,
        moduleCommand: transfer,
        id: '',
        params: {
          amount: '100000000',
          recipient: { address: accounts.delegate.summary.address },
          data: '',
        },
      });
    });

    it('should a register delegate transaction with type signature of lisk service', () => {
      const [module, command] = splitModuleAndCommand(registerDelegate);
      const tx = {
        ...baseElementsTx,
        module,
        command,
        params: {
          username: 'super_delegate',
          generatorPublicKey: convertStringToBinary(genKey),
          blsPublicKey: convertStringToBinary(blsKey),
          proofOfPossession: convertStringToBinary(pop),
        },
      };

      expect(elementTxToDesktopTx(tx)).toEqual({
        ...baseDesktopTx,
        moduleCommand: registerDelegate,
        id: '',
        params: {
          username: 'super_delegate',
          generatorPublicKey: genKey,
          blsPublicKey: blsKey,
          proofOfPossession: pop,
        },
      });
    });

    it('should a vote delegate transaction with type signature of lisk service', () => {
      const [module, command] = splitModuleAndCommand(voteDelegate);
      const tx = {
        ...baseElementsTx,
        module,
        command,
        params: {
          votes: [
            {
              amount: BigInt('100'),
              delegateAddress: getAddressFromBase32Address(accounts.delegate.summary.address),
            },
          ],
        },
      };

      expect(elementTxToDesktopTx(tx)).toEqual({
        ...baseDesktopTx,
        moduleCommand: voteDelegate,
        id: '',
        params: {
          votes: [
            {
              amount: '100',
              delegateAddress: accounts.delegate.summary.address,
            },
          ],
        },
      });
    });

    it('should transform a reclaimLSK transaction', () => {
      const [module, command] = splitModuleAndCommand(reclaim);
      const tx = {
        ...baseElementsTx,
        module,
        command,
        params: {
          amount: BigInt(100),
        },
      };

      expect(elementTxToDesktopTx(tx)).toEqual({
        ...baseDesktopTx,
        moduleCommand: reclaim,
        id: '',
        params: {
          amount: '100',
        },
      });
    });

    it('should transform a unlockToken transaction', () => {
      const [module, command] = splitModuleAndCommand(unlock);
      const unlockObjects = [
        {
          delegateAddress:
            getAddressFromBase32Address(accounts.delegate.summary.address),
          amount: BigInt('10000000'),
          unvoteHeight: 1000000,
        },
        {
          delegateAddress:
            getAddressFromBase32Address(accounts.send_all_wallet.summary.address),
          amount: BigInt('-10000000'),
          unvoteHeight: 1000000,
        },
      ];

      const tx = {
        ...baseElementsTx,
        module,
        command,
        params: { unlockObjects },
      };

      expect(elementTxToDesktopTx(tx)).toEqual({
        ...baseDesktopTx,
        moduleCommand: unlock,
        id: '',
        params: {
          unlockObjects: tx.params.unlockObjects.map(item => ({
            amount: String(item.amount),
            delegateAddress: getBase32AddressFromAddress(item.delegateAddress),
            unvoteHeight: item.unvoteHeight,
          })),
        },
      });
    });

    it('should transform a registerMultisignatureGroup transaction', () => {
      const [module, command] = splitModuleAndCommand(registerMultisignatureGroup);
      const mandatoryKeys = [
        accounts.genesis.summary.publicKey,
        accounts.delegate.summary.publicKey,
      ].map(key => convertStringToBinary(key));
      const optionalKeys = [
        accounts.delegate_candidate.summary.publicKey,
      ].map(key => convertStringToBinary(key));

      const tx = {
        ...baseElementsTx,
        module,
        command,
        params: {
          numberOfSignatures: 2,
          mandatoryKeys,
          optionalKeys,
        },
      };

      expect(elementTxToDesktopTx(tx)).toEqual({
        ...baseDesktopTx,
        moduleCommand: registerMultisignatureGroup,
        id: '',
        params: {
          numberOfSignatures: 2,
          mandatoryKeys: [
            accounts.genesis.summary.publicKey,
            accounts.delegate.summary.publicKey,
          ],
          optionalKeys: [
            accounts.delegate_candidate.summary.publicKey,
          ],
        },
      });
    });
  });

  describe('containsTransactionType', () => {
    it('should return true', () => {
      let pending = [{ moduleCommand: voteDelegate }];
      expect(containsTransactionType(pending, voteDelegate)).toEqual(true);

      pending = [{ moduleCommand: transfer }, { moduleCommand: voteDelegate }];
      expect(containsTransactionType(pending, voteDelegate)).toEqual(true);
    });

    it('should return false', () => {
      let pending = [];
      expect(containsTransactionType(pending, voteDelegate)).toEqual(false);

      pending = [{ moduleCommand: transfer }];
      expect(containsTransactionType(pending, voteDelegate)).toEqual(false);
    });
  });

  describe('transactionToJSON', () => {
    beforeEach(() => {
      // eslint-disable-next-line no-extend-native
      BigInt.prototype.toJSON = function () { return `${this.toString()}n`; };
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
        recipientAddress: getBase32AddressFromAddress(accounts.delegate.summary.address),
        data: '',
      },
    };
    it('should return the transaction as JSON', () => {
      expect(JSON.parse(transactionToJSON(transaction)))
        .toEqual({
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
      expect(
        removeExcessSignatures(signatures, mandatoryKeysNo, hasSenderSignature),
      ).toEqual(expectSignatures);
    });
  });
});
