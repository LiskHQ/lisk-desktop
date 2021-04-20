
import {
  MODULE_ASSETS_NAME_ID_MAP,
} from '@constants';
import { extractAddressFromPublicKey, getBase32AddressFromAddress, getAddressFromBase32Address } from '@utils/account';
import { splitModuleAndAssetIds } from '@utils/moduleAssets';

const {
  transfer, voteDelegate, registerDelegate, unlockToken,
} = MODULE_ASSETS_NAME_ID_MAP;
/**
 * Gets the amount of a given transaction
 *
 * @param {Object} transaction The transaction object
 * @returns {String} Amount in Beddows/Satoshi
 */
const getTxAmount = ({ moduleAssetId, asset }) => {
  if (moduleAssetId === transfer) {
    return asset.amount;
  }

  if (moduleAssetId === unlockToken) {
    return asset.unlockingObjects.reduce((sum, unlockingObject) =>
      sum + parseInt(unlockingObject.amount, 10), 0);
  }
  if (moduleAssetId === voteDelegate) {
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
    case transfer: {
      transformedTransaction.asset = {
        recipient: { address: getBase32AddressFromAddress(transaction.asset.recipientAddress) },
        amount: String(transaction.asset.amount),
        data: transaction.asset.data,
      };

      break;
    }

    case registerDelegate: {
      transformedTransaction.asset = {
        username: transaction.asset.username,
      };
      break;
    }

    case voteDelegate: {
      transformedTransaction.asset = {
        votes: transaction.asset.votes.map(vote => ({
          amount: Number(vote.amount),
          delegateAddress: getBase32AddressFromAddress(vote.delegateAddress),
        })),
      };
      break;
    }

    case unlockToken: {
      transformedTransaction.asset = {
        unlockObjects: transaction.asset.unlockObjects.map(unlockingObject => ({
          delegateAddress: getBase32AddressFromAddress(unlockingObject.delegateAddress),
          amount: Number(unlockingObject.amount),
          unvoteHeight: unlockingObject.height.start,
        })),
      };
      break;
    }

    // case registerMultisignatureGroup: {
    // @todo fix me
    // transformedTransaction.asset = {
    //   numberOfSignatures: tx.numberOfSignatures,
    //   mandatoryKeys: tx.mandatoryKeys,
    //   optionalKeys: tx.optionalKeys,
    // };
    // break;
    // }

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
    case transfer: {
      const binaryAddress = recipientAddress
        ? getAddressFromBase32Address(recipientAddress) : Buffer.from('');

      transaction.asset = {
        recipientAddress: binaryAddress,
        amount: BigInt(amount),
        data,
      };

      break;
    }

    case registerDelegate: {
      transaction.asset = {
        username: tx.username,
      };
      break;
    }

    case voteDelegate: {
      const votes = tx.votes.map(vote => ({
        amount: BigInt(vote.amount),
        delegateAddress: getAddressFromBase32Address(vote.delegateAddress),
      }));
      transaction.asset = { votes };
      break;
    }

    case unlockToken: {
      transaction.asset = {
        unlockObjects: tx.unlockingObjects.map(unlockingObject => ({
          amount: BigInt(unlockingObject.amount),
          delegateAddress: getAddressFromBase32Address(unlockingObject.delegateAddress),
          unvoteHeight: unlockingObject.unvoteHeight,
        })),
      };
      break;
    }

    // case registerMultisignatureGroup: {
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

  return transaction;
};

export { getTxAmount, transformTransaction, createTransactionObject };
