import { MODULE_ASSETS_NAME_ID_MAP } from '@constants';
import { splitModuleAndAssetIds } from '@utils/moduleAssets';
import { getTxAmount, transformTransaction } from './transaction';
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

  describe('transformTransaction', () => {
    const binaryAddress = 'd04699e57c4a3846c988f3c15306796f8eae5c1c';

    it('should a transfer transaction with type signature of lisk service', () => {
      const [moduleID, assetID] = splitModuleAndAssetIds(MODULE_ASSETS_NAME_ID_MAP.transfer);
      const tx = {
        moduleID,
        assetID,
        fee: 0.1,
        nonce: 1,
        id: Buffer.from('123', 'hex'),
        senderPublicKey: accounts.genesis.summary.publicKey,
        asset: { amount: 100000000, recipientAddress: binaryAddress, data: '' },
      };

      const expectedTransaction = {
        id: '12',
        moduleAssetId: '2:0',
        fee: '0.1',
        nonce: '1',
        sender: {
          publicKey: '0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a',
          address: 'lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt',
        },
        signatures: undefined,
        asset: {
          recipient: {
            address: 'lskzzzz3xu4xpzz6x2zzuzzbvzpz2zzrvz3zzxuzz3mzozzox24z2zzuzzzzzvuzz3z577dz7',
          },
          amount: '100000000',
          data: '',
        },
      };

      expect(transformTransaction(tx)).toMatchObject(expectedTransaction);
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

      const expectedTransaction = {
        id: '12',
        moduleAssetId: '5:0',
        fee: '0.1',
        nonce: '1',
        sender: {
          publicKey: '0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a',
          address: 'lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt',
        },
        signatures: undefined,
        asset: {
          username: 'super_delegate',
        },
      };

      expect(transformTransaction(tx)).toMatchObject(expectedTransaction);
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
          votes: [{
            amount: '100',
            delegateAddress: '123',
          }],
        },
      };

      const expectedTransaction = {
        id: '12',
        moduleAssetId: '5:1',
        fee: '0.1',
        nonce: '1',
        sender: {
          publicKey: '0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a',
          address: 'lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt',
        },
        signatures: undefined,
        asset: {
          votes: [{
            amount: 100,
            delegateAddress: 'lskzpxzckpryh',
          }],
        },
      };

      expect(transformTransaction(tx)).toMatchObject(expectedTransaction);
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

      const expectedTransaction = {
        id: '12',
        moduleAssetId: '1000:0',
        fee: '0.1',
        nonce: '1',
        sender: {
          publicKey: '0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a',
          address: 'lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt',
        },
        signatures: undefined,
        asset: {
          amount: '100',
        },
      };

      expect(transformTransaction(tx)).toMatchObject(expectedTransaction);
    });
  });

  describe('containsTransactionType', () => {
    it('should return true', () => {
      let pending = [
        { moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.voteDelegate },
      ];
      expect(containsTransactionType(
        pending, MODULE_ASSETS_NAME_ID_MAP.voteDelegate,
      )).toEqual(true);
      pending = [
        { moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.transfer },
        { moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.voteDelegate },
      ];
      expect(containsTransactionType(
        pending, MODULE_ASSETS_NAME_ID_MAP.voteDelegate,
      )).toEqual(true);
    });

    it('should return false', () => {
      let pending = [];
      expect(containsTransactionType(
        pending, MODULE_ASSETS_NAME_ID_MAP.voteDelegate,
      )).toEqual(false);
      pending = [{ moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.transfer }];
      expect(containsTransactionType(
        pending, MODULE_ASSETS_NAME_ID_MAP.voteDelegate,
      )).toEqual(false);
    });
  });
});
