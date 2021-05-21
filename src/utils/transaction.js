import {
  MODULE_ASSETS_NAME_ID_MAP,
} from '@constants';
import {
  extractAddressFromPublicKey,
  getBase32AddressFromAddress,
  getAddressFromBase32Address,
} from '@utils/account';
import { transformStringDateToUnixTimestamp } from '@utils/datetime';
import { toRawLsk } from '@utils/lsk';
import { splitModuleAndAssetIds } from '@utils/moduleAssets';

const {
  transfer, voteDelegate, registerDelegate, unlockToken, reclaimLSK,
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
    return asset.unlockObjects.reduce((sum, unlockObject) =>
      sum + parseInt(unlockObject.amount, 10), 0);
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

    case reclaimLSK: {
      transformedTransaction.asset = {
        amount: transaction.asset.amount,
      };
      break;
    }

    case unlockToken: {
      transformedTransaction.asset = {
        unlockObjects: transaction.asset.unlockObjects.map(unlockObject => ({
          delegateAddress: getBase32AddressFromAddress(unlockObject.delegateAddress),
          amount: Number(unlockObject.amount),
          unvoteHeight: unlockObject.height.start,
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

    case reclaimLSK: {
      transaction.asset = {
        amount: BigInt(amount),
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

export const containsTransactionType = (transactions = [], type) =>
  transactions.some(tx => tx.moduleAssetId === type);

/**
 * Adapts transaction filter params to match transactions API method
 *
 * @param {Object} params - Params received from withFilters HOC
 * @returns {Object} - Parameters consumable by transaction API method
 */
export const normalizeTransactionParams = params => Object.keys(params)
  // eslint-disable-next-line complexity
  .reduce((acc, item) => {
    switch (item) {
      case 'dateFrom':
        if (params[item]) {
          if (!acc.timestamp) acc.timestamp = ':';
          acc.timestamp = acc.timestamp
            .replace(/(\d+)?:/, `${transformStringDateToUnixTimestamp(params[item])}:`);
        }
        break;
      case 'dateTo':
        if (params[item]) {
          if (!acc.timestamp) acc.timestamp = ':';
          // We add 86400 so the range is inclusive
          acc.timestamp = acc.timestamp
            .replace(/:(\d+)?/, `:${transformStringDateToUnixTimestamp(params[item]) + 86400}`);
        }
        break;
      case 'amountFrom':
        if (params[item]) {
          if (!acc.amount) acc.amount = ':';
          acc.amount = acc.amount.replace(/(\d+)?:/, `${toRawLsk(params[item])}:`);
        }
        break;
      case 'amountTo':
        if (params[item]) {
          if (!acc.amount) acc.amount = ':';
          acc.amount = acc.amount.replace(/:(\d+)?/, `:${toRawLsk(params[item])}`);
        }
        break;
      default:
        acc[item] = params[item];
    }

    return acc;
  }, {});

export { getTxAmount, transformTransaction, createTransactionObject };
