import { MODULE_COMMANDS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import { splitModuleAndCommandIds } from '@transaction/utils/moduleAssets';
import {
  getAddressFromBase32Address,
  getBase32AddressFromAddress,
} from '@wallet/utils/account';
import accounts from '@tests/constants/wallets';
import {
  getTxAmount,
  elementTxToDesktopTx,
  containsTransactionType,
  desktopTxToElementsTx,
  transactionToJSON,
  removeExcessSignatures,
  convertStringToBinary,
} from './transaction';

const {
  transfer, voteDelegate, registerMultisignatureGroup, registerDelegate, reclaimLSK, unlockToken,
} = MODULE_COMMANDS_NAME_ID_MAP;

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
        moduleCommandID: transfer,
        params: { amount: 100000000 },
      };

      expect(getTxAmount(tx)).toEqual(tx.params.amount);
    });

    it('should return amount of votes in Beddows', () => {
      const tx = {
        title: voteDelegate,
        moduleCommandID: voteDelegate,
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
        title: unlockToken,
        moduleCommandID: unlockToken,
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
        moduleCommandID: transfer,
        params: {
          recipient: { address: accounts.delegate.summary.address },
          amount: 100000000,
          data: 'test',
        },
      };
      const txObj = desktopTxToElementsTx(tx, transfer);
      const [moduleID, commandID] = splitModuleAndCommandIds(transfer);
      expect(txObj).toEqual({
        ...baseElementsTx,
        moduleID,
        commandID,
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
        moduleCommandID: voteDelegate,
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
      const [moduleID, commandID] = splitModuleAndCommandIds(voteDelegate);
      expect(txObj).toEqual({
        ...baseElementsTx,
        moduleID,
        commandID,
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
        moduleCommandID: registerDelegate,
        params: {
          username: 'username',
        },
      };
      const txObj = desktopTxToElementsTx(tx, registerDelegate);
      const [moduleID, commandID] = splitModuleAndCommandIds(registerDelegate);
      expect(txObj).toEqual({
        ...baseElementsTx,
        moduleID,
        commandID,
        params: {
          username: 'username',
        },
      });
    });

    it('creates a transaction object for reclaimLSK transaction', () => {
      const tx = {
        ...baseDesktopTx,
        moduleCommandID: reclaimLSK,
        params: {
          amount: '10000000',
        },
      };
      const txObj = desktopTxToElementsTx(tx, reclaimLSK);
      const [moduleID, commandID] = splitModuleAndCommandIds(reclaimLSK);
      expect(txObj).toEqual({
        ...baseElementsTx,
        moduleID,
        commandID,
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
        moduleCommandID: unlockToken,
        params: {
          unlockObjects,
        },
      };
      const txObj = desktopTxToElementsTx(tx, unlockToken);
      const [moduleID, commandID] = splitModuleAndCommandIds(unlockToken);
      expect(txObj).toEqual({
        ...baseElementsTx,
        moduleID,
        commandID,
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
        moduleCommandID: registerMultisignatureGroup,
        params: {
          numberOfSignatures: 2,
          mandatoryKeys: [accounts.genesis.summary.publicKey, accounts.delegate.summary.publicKey],
          optionalKeys: [accounts.delegate_candidate.summary.publicKey],
        },
      };
      const txObj = desktopTxToElementsTx(tx, registerMultisignatureGroup);
      const [moduleID, commandID] = splitModuleAndCommandIds(registerMultisignatureGroup);
      expect(txObj).toEqual({
        ...baseElementsTx,
        moduleID,
        commandID,
        params: {
          numberOfSignatures: 2,
          mandatoryKeys: tx.params.mandatoryKeys.map(() => expect.arrayContaining([])),
          optionalKeys: tx.params.optionalKeys.map(() => expect.arrayContaining([])),
        },
      });
    });
  });

  describe.skip('elementTxToDesktopTx', () => {
    it('should a transfer transaction with type signature of lisk service', () => {
      const [moduleID, commandID] = splitModuleAndCommandIds(transfer);
      const tx = {
        ...baseElementsTx,
        moduleID,
        commandID,
        params: {
          amount: BigInt(100000000),
          recipientAddress: getAddressFromBase32Address(accounts.delegate.summary.address),
          data: '',
        },
      };

      expect(elementTxToDesktopTx(tx)).toEqual({
        ...baseDesktopTx,
        moduleCommandID: transfer,
        id: '',
        params: {
          amount: '100000000',
          recipient: { address: accounts.delegate.summary.address },
          data: '',
        },
      });
    });

    it('should a register delegate transaction with type signature of lisk service', () => {
      const [moduleID, commandID] = splitModuleAndCommandIds(registerDelegate);
      const tx = {
        ...baseElementsTx,
        moduleID,
        commandID,
        params: { username: 'super_delegate' },
      };

      expect(elementTxToDesktopTx(tx)).toEqual({
        ...baseDesktopTx,
        moduleCommandID: registerDelegate,
        id: '',
        params: { username: 'super_delegate' },
      });
    });

    it('should a vote delegate transaction with type signature of lisk service', () => {
      const [moduleID, commandID] = splitModuleAndCommandIds(voteDelegate);
      const tx = {
        ...baseElementsTx,
        moduleID,
        commandID,
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
        moduleCommandID: voteDelegate,
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
      const [moduleID, commandID] = splitModuleAndCommandIds(reclaimLSK);
      const tx = {
        ...baseElementsTx,
        moduleID,
        commandID,
        params: {
          amount: BigInt(100),
        },
      };

      expect(elementTxToDesktopTx(tx)).toEqual({
        ...baseDesktopTx,
        moduleCommandID: reclaimLSK,
        id: '',
        params: {
          amount: '100',
        },
      });
    });

    it('should transform a unlockToken transaction', () => {
      const [moduleID, commandID] = splitModuleAndCommandIds(unlockToken);
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
        moduleID,
        commandID,
        params: { unlockObjects },
      };

      expect(elementTxToDesktopTx(tx)).toEqual({
        ...baseDesktopTx,
        moduleCommandID: unlockToken,
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
      const [moduleID, commandID] = splitModuleAndCommandIds(registerMultisignatureGroup);
      const mandatoryKeys = [
        accounts.genesis.summary.publicKey,
        accounts.delegate.summary.publicKey,
      ].map(key => convertStringToBinary(key));
      const optionalKeys = [
        accounts.delegate_candidate.summary.publicKey,
      ].map(key => convertStringToBinary(key));

      const tx = {
        ...baseElementsTx,
        moduleID,
        commandID,
        params: {
          numberOfSignatures: 2,
          mandatoryKeys,
          optionalKeys,
        },
      };

      expect(elementTxToDesktopTx(tx)).toEqual({
        ...baseDesktopTx,
        moduleCommandID: registerMultisignatureGroup,
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
      let pending = [{ moduleCommandID: voteDelegate }];
      expect(containsTransactionType(pending, voteDelegate)).toEqual(true);

      pending = [{ moduleCommandID: transfer }, { moduleCommandID: voteDelegate }];
      expect(containsTransactionType(pending, voteDelegate)).toEqual(true);
    });

    it('should return false', () => {
      let pending = [];
      expect(containsTransactionType(pending, voteDelegate)).toEqual(false);

      pending = [{ moduleCommandID: transfer }];
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
      moduleID: 2,
      commandID: 0,
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
          moduleID: 2,
          commandID: 0,
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
