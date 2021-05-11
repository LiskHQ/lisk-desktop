import { MODULE_ASSETS_NAME_ID_MAP } from '@constants';
import { splitModuleAndAssetIds } from '@utils/moduleAssets';
import {
  getTxAmount,
  transformTransaction,
  containsTransactionType,
  createTransactionObject,
} from './transaction';
import accounts from '../../test/constants/accounts';

describe('API: LSK Transactions', () => {
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
      const txObj = createTransactionObject(
        tx,
        MODULE_ASSETS_NAME_ID_MAP.transfer,
      );

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
      const txObj = createTransactionObject(
        tx,
        MODULE_ASSETS_NAME_ID_MAP.voteDelegate,
      );

      expect(txObj).toMatchSnapshot();
    });

    it('creates a transaction object for delegate registration transaction', () => {
      const tx = {
        senderPublicKey: '',
        nonce: 1,
        fee: '1000000',
        username: 'username',
      };
      const txObj = createTransactionObject(
        tx,
        MODULE_ASSETS_NAME_ID_MAP.registerDelegate,
      );

      expect(txObj).toMatchSnapshot();
    });

    it('creates a transaction object for reclaimLSK transaction', () => {
      const tx = {
        senderPublicKey: '',
        nonce: 1,
        fee: '1000000',
        amount: '10000000',
      };
      const txObj = createTransactionObject(
        tx,
        MODULE_ASSETS_NAME_ID_MAP.reclaimLSK,
      );

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
        optionalKeys: [accounts.second_passphrase_account.summary.publicKey],
      };
      const txObj = createTransactionObject(
        tx,
        MODULE_ASSETS_NAME_ID_MAP.registerMultisignatureGroup,
      );

      expect(txObj).toMatchSnapshot();
    });
  });

  describe('transformTransaction', () => {
    const binaryAddress = 'd04699e57c4a3846c988f3c15306796f8eae5c1c';

    it('should a transfer transaction with type signature of lisk service', () => {
      const [moduleID, assetID] = splitModuleAndAssetIds(
        MODULE_ASSETS_NAME_ID_MAP.transfer,
      );
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
      const [moduleID, assetID] = splitModuleAndAssetIds(
        MODULE_ASSETS_NAME_ID_MAP.registerDelegate,
      );
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
      const [moduleID, assetID] = splitModuleAndAssetIds(
        MODULE_ASSETS_NAME_ID_MAP.voteDelegate,
      );
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
      const [moduleID, assetID] = splitModuleAndAssetIds(
        MODULE_ASSETS_NAME_ID_MAP.reclaimLSK,
      );
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

    it('should transform a registerMultisignatureGroup transaction', () => {
      const [moduleID, assetID] = splitModuleAndAssetIds(
        MODULE_ASSETS_NAME_ID_MAP.registerMultisignatureGroup,
      );
      const mandatoryKeys = [accounts.genesis.summary.publicKey, accounts.delegate.summary.publicKey].map(key => Buffer.from(key, 'hex'));
      const optionalKeys = [accounts.second_passphrase_account.summary.publicKey].map(key => Buffer.from(key, 'hex'));

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
    const { transfer, voteDelegate } = MODULE_ASSETS_NAME_ID_MAP;

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
});
