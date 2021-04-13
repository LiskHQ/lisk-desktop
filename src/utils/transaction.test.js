import { MODULE_ASSETS_NAME_ID_MAP } from '@constants';
import { getTxAmount, transformTransaction } from './transaction';
import accounts from '../../test/constants/accounts';
import { splitModuleAndAssetIds } from '@utils/moduleAssets';

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

  describe.only('transformTransaction', () => {
    const [moduleID, assetID] = splitModuleAndAssetIds(MODULE_ASSETS_NAME_ID_MAP.transfer);
    const binaryAddress = 'd04699e57c4a3846c988f3c15306796f8eae5c1c';

    it('should a transfer transaction with type signature of lisk service', () => {
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
  });
});
