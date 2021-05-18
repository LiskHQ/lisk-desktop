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
import { splitModuleAndAssetIds, joinModuleAndAssetIds } from '@utils/moduleAssets';

const {
  transfer, voteDelegate, registerDelegate, unlockToken, reclaimLSK, registerMultisignatureGroup,
} = MODULE_ASSETS_NAME_ID_MAP;

const EMPTY_BUFFER = Buffer.from('');
const convertStringToBinary = value => Buffer.from(value, 'hex');
const convertBinaryToString = value => value.toString('hex');

/**
 * Converts a transaction returned by lisk elements back to the signature
 * used by lisk desktop
 * @param {object} transaction - the transaction object
 * @returns the transformed transaction
 */
// eslint-disable-next-line max-statements
const transformTransaction = ({
  moduleID, assetID, id, asset, nonce, fee, senderPublicKey, signatures,
}) => {
  const moduleAssetId = joinModuleAndAssetIds({ moduleID, assetID });
  const senderAddress = extractAddressFromPublicKey(senderPublicKey);
  const transformedTransaction = {
    moduleAssetId,
    id: convertBinaryToString(id),
    fee: String(fee),
    nonce: String(nonce),
    signatures,
    sender: {
      address: senderAddress,
      publicKey: convertBinaryToString(senderPublicKey),
    },
  };

  switch (moduleAssetId) {
    case transfer: {
      transformedTransaction.asset = {
        data: asset.data,
        amount: String(asset.amount),
        recipient: { address: getBase32AddressFromAddress(asset.recipientAddress) },
      };

      break;
    }

    case registerDelegate: {
      transformedTransaction.asset = {
        username: asset.username,
      };
      break;
    }

    case voteDelegate: {
      transformedTransaction.asset = {
        votes: asset.votes.map(vote => ({
          amount: Number(vote.amount),
          delegateAddress: getBase32AddressFromAddress(vote.delegateAddress),
        })),
      };
      break;
    }

    case reclaimLSK: {
      transformedTransaction.asset = {
        amount: asset.amount,
      };
      break;
    }

    case unlockToken: {
      transformedTransaction.asset = {
        unlockObjects: asset.unlockObjects.map(unlockingObject => ({
          delegateAddress: getBase32AddressFromAddress(unlockingObject.delegateAddress),
          amount: Number(unlockingObject.amount),
          unvoteHeight: unlockingObject.height.start,
        })),
      };
      break;
    }

    case registerMultisignatureGroup: {
      transformedTransaction.asset = {
        numberOfSignatures: asset.numberOfSignatures,
        mandatoryKeys: asset.mandatoryKeys.map(convertBinaryToString),
        optionalKeys: asset.optionalKeys.map(convertBinaryToString),
      };
      break;
    }

    default:
      throw Error('Unknown transaction');
  }

  return transformedTransaction;
};

/**
 * creates a transaction object to be used with the api client from
 * lisk elements
 * @param {object} tx - the transaction data
 * @param {string} moduleAssetId - moduleAssetId
 * @returns the transaction object
 */
// eslint-disable-next-line max-statements
const createTransactionObject = (tx, moduleAssetId) => {
  const [moduleID, assetID] = splitModuleAndAssetIds(moduleAssetId);
  const {
    senderPublicKey, nonce, amount, recipientAddress, data, fee = 0,
  } = tx;

  const transaction = {
    moduleID,
    assetID,
    senderPublicKey: convertStringToBinary(senderPublicKey),
    nonce: BigInt(nonce),
    fee: BigInt(fee),
    signatures: [],
  };

  switch (moduleAssetId) {
    case transfer: {
      const binaryAddress = recipientAddress
        ? getAddressFromBase32Address(recipientAddress) : EMPTY_BUFFER;

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

    case registerMultisignatureGroup: {
      transaction.asset = {
        numberOfSignatures: Number(tx.numberOfSignatures),
        mandatoryKeys: tx.mandatoryKeys.map(convertStringToBinary),
        optionalKeys: tx.optionalKeys.map(convertStringToBinary),
      };
      break;
    }

    default:
      throw Error('Unknown transaction');
  }

  return transaction;
};

const containsTransactionType = (transactions = [], type) =>
  transactions.some(tx => tx.moduleAssetId === type);

/**
 * Adapts transaction filter params to match transactions API method
 *
 * @param {Object} params - Params received from withFilters HOC
 * @returns {Object} - Parameters consumable by transaction API method
 */
const normalizeTransactionParams = params => Object.keys(params)
  .reduce((acc, item) => {
    switch (item) {
      case 'dateFrom':
        if (!acc.timestamp) acc.timestamp = ':';
        acc.timestamp = acc.timestamp.replace(/(\d+)?:/, `${transformStringDateToUnixTimestamp(params[item])}:`);
        break;
      case 'dateTo':
        if (!acc.timestamp) acc.timestamp = ':';
        acc.timestamp = acc.timestamp.replace(/:(\d+)?/, `:${transformStringDateToUnixTimestamp(params[item])}`);
        break;
      case 'amountFrom':
        if (!acc.amount) acc.amount = ':';
        acc.amount = acc.amount.replace(/(\d+)?:/, `${toRawLsk(params[item])}:`);
        break;
      case 'amountTo':
        if (!acc.amount) acc.amount = ':';
        acc.amount = acc.amount.replace(/:(\d+)?/, `:${toRawLsk(params[item])}`);
        break;
      default:
        acc[item] = params[item];
    }

    return acc;
  }, {});

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
    return asset.unlockingObjects?.reduce((sum, unlockingObject) =>
      sum + Number(unlockingObject.amount), 0);
  }
  if (moduleAssetId === voteDelegate) {
    return asset.votes.reduce((sum, vote) =>
      sum + Number(vote.amount), 0);
  }

  return undefined;
};

export {
  getTxAmount,
  transformTransaction,
  containsTransactionType,
  createTransactionObject,
  normalizeTransactionParams,
};
