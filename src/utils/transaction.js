/* eslint-disable max-lines */
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
export const convertStringToBinary = value => Buffer.from(value, 'hex');
const convertBinaryToString = value => value.toString('hex');
const convertBigIntToString = value => {
  if (typeof value === 'bigint') {
    return String(value);
  }
  if (typeof value === 'string') {
    if (value.slice(-1) === 'n') {
      return value.slice(0, -1);
    }
    return value;
  }
  return String(value);
};

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
    fee: convertBigIntToString(fee),
    nonce: convertBigIntToString(nonce),
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
        amount: convertBigIntToString(asset.amount),
        recipient: { address: getBase32AddressFromAddress(Buffer.from(asset.recipientAddress, 'hex')) },
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
          amount: convertBigIntToString(vote.amount),
          delegateAddress: getBase32AddressFromAddress(Buffer.from(vote.delegateAddress, 'hex')),
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
        unlockObjects: asset.unlockObjects.map(unlockObject => ({
          delegateAddress: getBase32AddressFromAddress(Buffer.from(unlockObject.delegateAddress, 'hex')),
          amount: convertBigIntToString(unlockObject.amount),
          unvoteHeight: unlockObject.unvoteHeight,
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
    senderPublicKey, nonce, amount, recipientAddress, data, signatures = [], fee = 0,
  } = tx;

  const transaction = {
    moduleID,
    assetID,
    senderPublicKey: convertStringToBinary(senderPublicKey),
    nonce: BigInt(nonce),
    fee: BigInt(fee),
    signatures,
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
        unlockObjects: tx.unlockObjects.map(unlockObject => ({
          amount: BigInt(unlockObject.amount),
          delegateAddress: getAddressFromBase32Address(unlockObject.delegateAddress),
          unvoteHeight: unlockObject.unvoteHeight,
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

const isBufferArray = (arr) => arr.every(element => Buffer.isBuffer(element));

const convertBuffersToHex = (value) => {
  let result = value;
  if (Array.isArray(value) && isBufferArray(value)) {
    result = value.map(convertBinaryToString);
  } else if (Buffer.isBuffer(value)) {
    result = convertBinaryToString(value);
  }

  return result;
};

const convertObjectToHex = (data) => {
  const obj = {};
  // eslint-disable-next-line no-restricted-syntax, no-unused-vars, guard-for-in
  for (const key in data) {
    const value = data[key];
    if (key === 'votes' || key === 'unlockObjects') {
      obj[key] = value.map(item => convertObjectToHex(item));
    } else if (typeof value === 'object' && !Buffer.isBuffer(value) && !Array.isArray(value)) {
      obj[key] = convertObjectToHex(value);
    } else {
      obj[key] = convertBuffersToHex(value);
    }
  }
  return obj;
};

const transactionToJSON = (transaction) => {
  const obj = convertObjectToHex(transaction);
  return JSON.stringify(obj);
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
      sum + Number(vote.amount), 0);
  }

  return undefined;
};

/**
 * downloads the provided json to the user's machine
 * @param {object} data the payload to be stringified
 * @param {string} name the name of the JSON
 */
/* istanbul ignore next */
const downloadJSON = (data, name) => {
  const anchor = document.createElement('a');
  const json = transactionToJSON(data);
  anchor.setAttribute('href', `data:text/json;charset=utf-8,${encodeURIComponent(json)}`);
  anchor.setAttribute('download', `${name}.json`);
  anchor.click();
};

export {
  getTxAmount,
  downloadJSON,
  transactionToJSON,
  transformTransaction,
  containsTransactionType,
  createTransactionObject,
  normalizeTransactionParams,
};
