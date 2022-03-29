import { MODULE_ASSETS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import { splitModuleAndAssetIds } from '@transaction/utilities/moduleAssets';
import { getAddressFromBase32Address } from '@wallet/utilities/account';
import accounts from '@tests/constants/accounts';
import {
  getTxAmount,
  transformTransaction,
  containsTransactionType,
  createTransactionObject,
  transactionToJSON,
  removeExcessSignatures,
} from './transaction';

const {
  transfer, voteDelegate, registerMultisignatureGroup, registerDelegate, reclaimLSK, unlockToken,
} = MODULE_ASSETS_NAME_ID_MAP;

describe('API: LSK Transactions', () => {
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

  describe('createTransactionObject', () => {
    it('creates a transaction object for transfer transaction', () => {
      const tx = {
        senderPublicKey: '',
        nonce: 1,
        recipient: '',
        amount: '1',
        fee: '1000000',
        data: 'test',
      };
      const txObj = createTransactionObject(tx, transfer);

      expect(txObj).toMatchSnapshot();
    });

    it('creates a transaction object for vote transaction', () => {
      const tx = {
        senderPublicKey: '',
        nonce: 1,
        recipient: '',
        amount: '1',
        fee: '1000000',
        votes: [
          { amount: '100', delegateAddress: accounts.genesis.summary.address },
          {
            amount: '-100',
            delegateAddress: accounts.delegate.summary.address,
          },
        ],
      };
      const txObj = createTransactionObject(tx, voteDelegate);

      expect(txObj).toMatchSnapshot();
    });

    it('creates a transaction object for delegate registration transaction', () => {
      const tx = {
        senderPublicKey: '',
        nonce: 1,
        fee: '1000000',
        username: 'username',
      };
      const txObj = createTransactionObject(tx, registerDelegate);

      expect(txObj).toMatchSnapshot();
    });

    it('creates a transaction object for reclaimLSK transaction', () => {
      const tx = {
        senderPublicKey: '',
        nonce: 1,
        fee: '1000000',
        amount: '10000000',
      };
      const txObj = createTransactionObject(tx, reclaimLSK);

      expect(txObj).toMatchSnapshot();
    });

    it('creates a transaction object for unlockToken transaction', () => {
      const unlockObjects = [
        { delegateAddress: accounts.genesis.summary.address, amount: '-1000' },
        { delegateAddress: accounts.delegate.summary.address, amount: '1000' },
      ];
      const tx = {
        senderPublicKey: '',
        nonce: 1,
        fee: '1000000',
        unlockObjects,
      };
      const txObj = createTransactionObject(tx, unlockToken);

      expect(txObj).toMatchSnapshot();
    });

    it('creates a transaction object for registerMultisignatureGroup transaction', () => {
      const tx = {
        senderPublicKey: '',
        nonce: 1,
        fee: '1000000',
        amount: '10000000',
        numberOfSignatures: 2,
        mandatoryKeys: [accounts.genesis.summary.publicKey, accounts.delegate.summary.publicKey],
        optionalKeys: [accounts.delegate_candidate.summary.publicKey],
      };
      const txObj = createTransactionObject(tx, registerMultisignatureGroup);

      expect(txObj).toMatchSnapshot();
    });
  });

  describe('transformTransaction', () => {
    const binaryAddress = 'd04699e57c4a3846c988f3c15306796f8eae5c1c';

    it('should a transfer transaction with type signature of lisk service', () => {
      const [moduleID, assetID] = splitModuleAndAssetIds(transfer);
      const tx = {
        moduleID,
        assetID,
        fee: 0.1,
        nonce: 1,
        id: Buffer.from('123', 'hex'),
        senderPublicKey: accounts.genesis.summary.publicKey,
        asset: { amount: 100000000, recipientAddress: binaryAddress, data: '' },
      };

      expect(transformTransaction(tx)).toMatchSnapshot();
    });

    it('should a register delegate transaction with type signature of lisk service', () => {
      const [moduleID, assetID] = splitModuleAndAssetIds(registerDelegate);
      const tx = {
        moduleID,
        assetID,
        fee: 0.1,
        nonce: 1,
        id: Buffer.from('123', 'hex'),
        senderPublicKey: accounts.genesis.summary.publicKey,
        asset: { username: 'super_delegate' },
      };

      expect(transformTransaction(tx)).toMatchSnapshot();
    });

    it('should a vote delegate transaction with type signature of lisk service', () => {
      const [moduleID, assetID] = splitModuleAndAssetIds(voteDelegate);
      const tx = {
        moduleID,
        assetID,
        fee: 0.1,
        nonce: 1,
        id: Buffer.from('123', 'hex'),
        senderPublicKey: accounts.genesis.summary.publicKey,
        asset: {
          votes: [
            {
              amount: '100',
              delegateAddress: '123',
            },
          ],
        },
      };

      expect(transformTransaction(tx)).toMatchSnapshot();
    });

    it('should transform a reclaimLSK transaction', () => {
      const [moduleID, assetID] = splitModuleAndAssetIds(reclaimLSK);
      const tx = {
        moduleID,
        assetID,
        fee: 0.1,
        nonce: 1,
        id: Buffer.from('123', 'hex'),
        senderPublicKey: accounts.genesis.summary.publicKey,
        asset: {
          amount: '100',
        },
      };

      expect(transformTransaction(tx)).toMatchSnapshot();
    });

    it('should transform a unlockToken transaction', () => {
      const [moduleID, assetID] = splitModuleAndAssetIds(unlockToken);
      const unlockObjects = [
        {
          delegateAddress:
            getAddressFromBase32Address(accounts.delegate.summary.address),
          amount: 10000000n,
          unvoteHeight: 1000000,
        },
        {
          delegateAddress:
            getAddressFromBase32Address(accounts.send_all_account.summary.address),
          amount: -10000000n,
          unvoteHeight: 1000000,
        },
      ];

      const tx = {
        moduleID,
        assetID,
        fee: 0.1,
        nonce: 1,
        id: Buffer.from('123', 'hex'),
        senderPublicKey: accounts.genesis.summary.publicKey,
        asset: { unlockObjects },
      };

      expect(transformTransaction(tx)).toMatchSnapshot();
    });

    it('should transform a registerMultisignatureGroup transaction', () => {
      const [moduleID, assetID] = splitModuleAndAssetIds(registerMultisignatureGroup);
      const mandatoryKeys = [accounts.genesis.summary.publicKey, accounts.delegate.summary.publicKey].map(key => Buffer.from(key, 'hex'));
      const optionalKeys = [accounts.delegate_candidate.summary.publicKey].map(key => Buffer.from(key, 'hex'));

      const tx = {
        moduleID,
        assetID,
        id: Buffer.from('123', 'hex'),
        senderPublicKey: accounts.genesis.summary.publicKey,
        nonce: 1,
        fee: '1000000',
        amount: '10000000',
        asset: {
          numberOfSignatures: 2,
          mandatoryKeys,
          optionalKeys,
        },
      };

      expect(transformTransaction(tx)).toMatchSnapshot();
    });
  });

  describe('containsTransactionType', () => {
    it('should return true', () => {
      let pending = [{ moduleAssetId: voteDelegate }];
      expect(containsTransactionType(pending, voteDelegate)).toEqual(true);

      pending = [{ moduleAssetId: transfer }, { moduleAssetId: voteDelegate }];
      expect(containsTransactionType(pending, voteDelegate)).toEqual(true);
    });

    it('should return false', () => {
      let pending = [];
      expect(containsTransactionType(pending, voteDelegate)).toEqual(false);

      pending = [{ moduleAssetId: transfer }];
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
    const transaction = createTransactionObject({
      nonce: '2',
      amount: 10000,
      fee: '123123',
      senderPublicKey: accounts.genesis.summary.publicKey,
      recipientAddress: accounts.delegate.summary.address,
    }, transfer);
    it('should return the transaction as JSON', () => {
      const json = transactionToJSON(transaction);
      expect(json).toMatchSnapshot();
    });
  });

  describe('removeExcessSignatures', () => {
    it('should remove optional signature considering the sender signature', () => {
      const nonEmpty = Buffer.from(accounts.genesis.summary.publicKey, 'hex');
      const empty = Buffer.from('');
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
