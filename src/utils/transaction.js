
import {
  MODULE_ASSETS_NAME_ID_MAP,
} from '@constants';
import { extractAddressFromPublicKey, getBase32AddressFromAddress } from '@utils/account';
import { splitModuleAndAssetIds } from '@utils/moduleAssets';

/**
 * Gets the amount of a given transaction
 *
 * @param {Object} transaction The transaction object
 * @returns {String} Amount in Beddows/Satoshi
 */
const getTxAmount = ({ moduleAssetId, asset }) => {
  if (moduleAssetId === MODULE_ASSETS_NAME_ID_MAP.transfer) {
    return asset.amount;
  }

  if (moduleAssetId === MODULE_ASSETS_NAME_ID_MAP.unlockToken) {
    return asset.unlockingObjects.reduce((sum, unlockingObject) =>
      sum + parseInt(unlockingObject.amount, 10), 0);
  }
  if (moduleAssetId === MODULE_ASSETS_NAME_ID_MAP.voteDelegate) {
    return asset.votes.reduce((sum, vote) =>
      sum + parseInt(vote.amount, 10), 0);
  }

  return undefined;
};

// eslint-disable-next-line max-statements
const transformTransaction = (transaction) => {
  const moduleAssetId = [transaction.moduleID, transaction.assetID].join(':');
  const senderAddress = extractAddressFromPublicKey(transaction.senderPublicKey);
  const senderPublicKey = transaction.senderPublicKey.toString('hex');

  const transformedTransaction = {
    id: transaction.id.toString('hex'),
    moduleAssetId,
    fee: String(transaction.fee),
    nonce: String(transaction.nonce),
    sender: { publicKey: senderPublicKey, address: senderAddress },
    signatures: transaction.signatures,
  };

  switch (moduleAssetId) {
    case MODULE_ASSETS_NAME_ID_MAP.transfer: {
      transformedTransaction.asset = {
        recipient: { address: getBase32AddressFromAddress(transaction.asset.recipientAddress) },
        amount: String(transaction.asset.amount),
        data: transaction.asset.data,
      };

      break;
    }

    case MODULE_ASSETS_NAME_ID_MAP.registerDelegate: {
      // @todo fix me
      // transformedTransaction.asset = {
      //   username: tx.username,
      // };
      break;
    }

    case MODULE_ASSETS_NAME_ID_MAP.voteDelegate: {
      // @todo fix me
      // transformedTransaction.asset = {
      //   votes: tx.votes,
      // };
      break;
    }

    case MODULE_ASSETS_NAME_ID_MAP.unlockToken: {
      // @todo fix me
      // transformedTransaction.asset = {
      //   unlockObjects: tx.unlockObjects,
      // };
      break;
    }

    case MODULE_ASSETS_NAME_ID_MAP.registerMultisignatureGroup: {
      // @todo fix me
      // transformedTransaction.asset = {
      //   numberOfSignatures: tx.numberOfSignatures,
      //   mandatoryKeys: tx.mandatoryKeys,
      //   optionalKeys: tx.optionalKeys,
      // };
      break;
    }

    default:
      throw Error('Unknown transaction');
  }

  return transformedTransaction;
};

// eslint-disable-next-line max-statements
const createTransactionObject = (tx, moduleAssetId) => {
  const [moduleID, assetID] = splitModuleAndAssetIds(moduleAssetId);
  const {
    senderPublicKey, nonce, amount, recipientAddress, data, fee = 0,
  } = tx;

  const transaction = {
    moduleID,
    assetID,
    senderPublicKey: Buffer.from(senderPublicKey, 'hex'),
    nonce: BigInt(nonce),
    fee: BigInt(fee),
    signatures: [],
  };

  switch (moduleAssetId) {
    case MODULE_ASSETS_NAME_ID_MAP.transfer: {
      transaction.asset = {
        recipientAddress: getBase32AddressFromAddress(recipientAddress),
        amount: BigInt(amount),
        data,
      };
      break;
    }

    case MODULE_ASSETS_NAME_ID_MAP.registerDelegate: {
      transaction.asset = {
        username: tx.username,
      };
      break;
    }

    case MODULE_ASSETS_NAME_ID_MAP.voteDelegate: {
      const votes = tx.votes.map(vote =>
        ({ amount: BigInt(vote.amount), delegateAddress: Buffer.from(vote.delegateAddress) }));
      transaction.asset = { votes };
      break;
    }

    case MODULE_ASSETS_NAME_ID_MAP.unlockToken: {
      transaction.asset = {
        unlockObjects: tx.unlockObjects,
      };
      break;
    }

    // case MODULE_ASSETS_NAME_ID_MAP.registerMultisignatureGroup: {
    //   transaction.asset = {
    //     numberOfSignatures: tx.numberOfSignatures,
    //     mandatoryKeys: tx.mandatoryKeys,
    //     optionalKeys: tx.optionalKeys,
    //   };
    //   break;
    // }

    default:
      throw Error('Unknown transaction');
  }

  console.log(transaction);
  return transaction;
};

export { getTxAmount, transformTransaction, createTransactionObject };
