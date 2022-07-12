import { MODULE_ASSETS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import { splitModuleAndAssetIds } from '@transaction/utils/moduleAssets';
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
} = MODULE_ASSETS_NAME_ID_MAP;

const genKey = 'dcad7c69505d549803fb6a755e81cdcb0a33ea95b6476e2585149f8a42c9c882';
const blsKey = '830ce8c4a0b4f40b9b2bd2f16e835676b003ae28ec367432af9bfaa4d5201051786643620eff288077c1e7a8415c0285';
const pop = '722b19e4b302e3e13ef097b417b651feadc8e28754530119911561c27b9478cdcd6b7ada331037bbda778b0b325aab5a79f34b31ea780acd01bf67d38268c43ea0ea75a5e757a76165253e1e20680c4cfd884ed63f5663c7b940e67162d5f715';

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

  describe('desktopTxToElementsTx', () => {
    it('creates a transaction object for transfer transaction', () => {
      const tx = {
        ...baseDesktopTx,
        moduleAssetId: transfer,
        asset: {
          recipient: { address: accounts.delegate.summary.address },
          amount: 100000000,
          data: 'test',
        },
      };
      const txObj = desktopTxToElementsTx(tx, transfer);
      const [moduleID, assetID] = splitModuleAndAssetIds(transfer);
      expect(txObj).toEqual({
        ...baseElementsTx,
        moduleID,
        assetID,
        asset: {
          recipientAddress: expect.arrayContaining([]),
          amount: BigInt(100000000),
          data: 'test',
        },
      });
    });

    it('creates a transaction object for vote transaction', () => {
      const tx = {
        ...baseDesktopTx,
        moduleAssetId: voteDelegate,
        asset: {
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
      const [moduleID, assetID] = splitModuleAndAssetIds(voteDelegate);
      expect(txObj).toEqual({
        ...baseElementsTx,
        moduleID,
        assetID,
        asset: {
          votes: tx.asset.votes.map(item => ({
            amount: BigInt(item.amount),
            delegateAddress: expect.arrayContaining([]),
          })),
        },
      });
    });

    it('creates a transaction object for delegate registration transaction', () => {
      const tx = {
        ...baseDesktopTx,
        moduleAssetId: registerDelegate,
        asset: {
          username: 'username',
          generatorPublicKey: genKey,
          blsPublicKey: blsKey,
          proofOfPossession: pop,
        },
      };
      const txObj = desktopTxToElementsTx(tx, registerDelegate);
      const [moduleID, assetID] = splitModuleAndAssetIds(registerDelegate);
      expect(txObj).toEqual({
        ...baseElementsTx,
        moduleID,
        assetID,
        asset: {
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
        moduleAssetId: reclaimLSK,
        asset: {
          amount: '10000000',
        },
      };
      const txObj = desktopTxToElementsTx(tx, reclaimLSK);
      const [moduleID, assetID] = splitModuleAndAssetIds(reclaimLSK);
      expect(txObj).toEqual({
        ...baseElementsTx,
        moduleID,
        assetID,
        asset: {
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
        moduleAssetId: unlockToken,
        asset: {
          unlockObjects,
        },
      };
      const txObj = desktopTxToElementsTx(tx, unlockToken);
      const [moduleID, assetID] = splitModuleAndAssetIds(unlockToken);
      expect(txObj).toEqual({
        ...baseElementsTx,
        moduleID,
        assetID,
        asset: {
          unlockObjects: tx.asset.unlockObjects.map(item => ({
            amount: BigInt(item.amount),
            delegateAddress: expect.arrayContaining([]),
          })),
        },
      });
    });

    it('creates a transaction object for registerMultisignatureGroup transaction', () => {
      const tx = {
        ...baseDesktopTx,
        moduleAssetId: registerMultisignatureGroup,
        asset: {
          numberOfSignatures: 2,
          mandatoryKeys: [accounts.genesis.summary.publicKey, accounts.delegate.summary.publicKey],
          optionalKeys: [accounts.delegate_candidate.summary.publicKey],
        },
      };
      const txObj = desktopTxToElementsTx(tx, registerMultisignatureGroup);
      const [moduleID, assetID] = splitModuleAndAssetIds(registerMultisignatureGroup);
      expect(txObj).toEqual({
        ...baseElementsTx,
        moduleID,
        assetID,
        asset: {
          numberOfSignatures: 2,
          mandatoryKeys: tx.asset.mandatoryKeys.map(() => expect.arrayContaining([])),
          optionalKeys: tx.asset.optionalKeys.map(() => expect.arrayContaining([])),
        },
      });
    });
  });

  describe('elementTxToDesktopTx', () => {
    it('should a transfer transaction with type signature of lisk service', () => {
      const [moduleID, assetID] = splitModuleAndAssetIds(transfer);
      const tx = {
        ...baseElementsTx,
        moduleID,
        assetID,
        asset: {
          amount: BigInt(100000000),
          recipientAddress: getAddressFromBase32Address(accounts.delegate.summary.address),
          data: '',
        },
      };

      expect(elementTxToDesktopTx(tx)).toEqual({
        ...baseDesktopTx,
        moduleAssetId: transfer,
        id: '',
        asset: {
          amount: '100000000',
          recipient: { address: accounts.delegate.summary.address },
          data: '',
        },
      });
    });

    it('should a register delegate transaction with type signature of lisk service', () => {
      const [moduleID, assetID] = splitModuleAndAssetIds(registerDelegate);
      const tx = {
        ...baseElementsTx,
        moduleID,
        assetID,
        asset: {
          username: 'super_delegate',
          generatorPublicKey: convertStringToBinary(genKey),
          blsPublicKey: convertStringToBinary(blsKey),
          proofOfPossession: convertStringToBinary(pop),
        },
      };

      expect(elementTxToDesktopTx(tx)).toEqual({
        ...baseDesktopTx,
        moduleAssetId: registerDelegate,
        id: '',
        asset: {
          username: 'super_delegate',
          generatorPublicKey: genKey,
          blsPublicKey: blsKey,
          proofOfPossession: pop,
        },
      });
    });

    it('should a vote delegate transaction with type signature of lisk service', () => {
      const [moduleID, assetID] = splitModuleAndAssetIds(voteDelegate);
      const tx = {
        ...baseElementsTx,
        moduleID,
        assetID,
        asset: {
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
        moduleAssetId: voteDelegate,
        id: '',
        asset: {
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
      const [moduleID, assetID] = splitModuleAndAssetIds(reclaimLSK);
      const tx = {
        ...baseElementsTx,
        moduleID,
        assetID,
        asset: {
          amount: BigInt(100),
        },
      };

      expect(elementTxToDesktopTx(tx)).toEqual({
        ...baseDesktopTx,
        moduleAssetId: reclaimLSK,
        id: '',
        asset: {
          amount: '100',
        },
      });
    });

    it('should transform a unlockToken transaction', () => {
      const [moduleID, assetID] = splitModuleAndAssetIds(unlockToken);
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
        assetID,
        asset: { unlockObjects },
      };

      expect(elementTxToDesktopTx(tx)).toEqual({
        ...baseDesktopTx,
        moduleAssetId: unlockToken,
        id: '',
        asset: {
          unlockObjects: tx.asset.unlockObjects.map(item => ({
            amount: String(item.amount),
            delegateAddress: getBase32AddressFromAddress(item.delegateAddress),
            unvoteHeight: item.unvoteHeight,
          })),
        },
      });
    });

    it('should transform a registerMultisignatureGroup transaction', () => {
      const [moduleID, assetID] = splitModuleAndAssetIds(registerMultisignatureGroup);
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
        assetID,
        asset: {
          numberOfSignatures: 2,
          mandatoryKeys,
          optionalKeys,
        },
      };

      expect(elementTxToDesktopTx(tx)).toEqual({
        ...baseDesktopTx,
        moduleAssetId: registerMultisignatureGroup,
        id: '',
        asset: {
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
    const transaction = {
      ...baseElementsTx,
      moduleID: 2,
      assetID: 0,
      asset: {
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
          assetID: 0,
          asset: {
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
