/* eslint-disable max-lines */
import { transactions, cryptography } from '@liskhq/lisk-client';
import { to } from 'await-to-js';
import { signTransactionByHW } from '@utils/hwManager';
import {
  DEFAULT_NUMBER_OF_SIGNATURES,
  MODULE_ASSETS_NAME_ID_MAP,
  signatureCollectionStatus,
} from '@constants';
import {
  extractAddressFromPublicKey,
  getBase32AddressFromAddress,
  getAddressFromBase32Address,
  getKeys,
} from '@utils/account';
import { transformStringDateToUnixTimestamp } from '@utils/datetime';
import { toRawLsk } from '@utils/lsk';
import { isEmpty } from '@utils/helpers';
import { splitModuleAndAssetIds, joinModuleAndAssetIds } from '@utils/moduleAssets';

const {
  transfer, voteDelegate, registerDelegate, unlockToken, reclaimLSK, registerMultisignatureGroup,
} = MODULE_ASSETS_NAME_ID_MAP;

const EMPTY_BUFFER = Buffer.from('');
export const convertStringToBinary = value => Buffer.from(value, 'hex');
const convertBinaryToString = value => {
  if (value instanceof Uint8Array) {
    return Buffer.from(value).toString('hex');
  }
  return value.toString('hex');
};
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

// eslint-disable-next-line max-statements
const flattenTransaction = ({ moduleAssetId, asset, ...rest }) => {
  const transaction = {
    moduleAssetId,
    fee: rest.fee,
    nonce: rest.nonce,
    senderPublicKey: rest.sender.publicKey,
    signatures: rest.signatures.map(signature => Buffer.from(signature, 'hex')),
  };

  switch (moduleAssetId) {
    case MODULE_ASSETS_NAME_ID_MAP.transfer: {
      transaction.recipientAddress = asset.recipient.address;
      transaction.amount = asset.amount;
      transaction.data = asset.data;
      break;
    }

    case MODULE_ASSETS_NAME_ID_MAP.voteDelegate:
      transaction.votes = asset.votes;
      break;

    case MODULE_ASSETS_NAME_ID_MAP.registerDelegate:
      transaction.username = asset.username;
      break;

    case MODULE_ASSETS_NAME_ID_MAP.unlockToken:
      transaction.unlockObjects = asset.unlockObjects;
      break;

    case MODULE_ASSETS_NAME_ID_MAP.registerMultisignatureGroup: {
      transaction.numberOfSignatures = asset.numberOfSignatures;
      transaction.mandatoryKeys = asset.mandatoryKeys;
      transaction.optionalKeys = asset.optionalKeys;
      break;
    }

    default:
      break;
  }

  return transaction;
};

const isBufferArray = (arr) => arr.every(element => {
  if (element instanceof Uint8Array) {
    return Buffer.isBuffer(Buffer.from(element));
  }

  return Buffer.isBuffer(element);
});

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

const containsTransactionType = (txs = [], type) =>
  txs.some(tx => tx.moduleAssetId === type);

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
  if (moduleAssetId === transfer || moduleAssetId === reclaimLSK) {
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

/**
 * Removes the excess signatures from optional members
 * to open up room for the mandatory ones
 *
 * @param {array} signatures - The transaction signatures array
 * @param {number} mandatoryKeysNo - Number of mandatory keys
 * @param {boolean} hasSenderSignature - Defines if the signatures list has
 * an extra sender signature at the beginning.
 * @returns {array} the trimmed array of signatures
 */
export const removeExcessSignatures = (signatures, mandatoryKeysNo, hasSenderSignature) => {
  const skip = hasSenderSignature ? 1 : 0;
  const firstOptional = skip + mandatoryKeysNo;
  let cleared = false;
  const trimmedSignatures = signatures.map((item, index) => {
    if (index >= firstOptional && item.length && !cleared) {
      cleared = true;
      return Buffer.from('');
    }
    return item;
  });
  return trimmedSignatures;
};

/**
 * Computes transaction id
 * @param {object} transaction
 * @returns {Promise} returns transaction id for a given transaction object
 */
export const computeTransactionId = ({ transaction, network }) => {
  const moduleAssetId = joinModuleAndAssetIds({
    moduleID: transaction.moduleID,
    assetID: transaction.assetID,
  });
  const schema = network.networks.LSK.moduleAssetSchemas[moduleAssetId];
  const transactionBytes = transactions.getBytes(schema, transaction);
  const id = cryptography.hash(transactionBytes);

  return id;
};

const signMultisigUsingPrivateKey = (
  schema, transaction, networkIdentifier, keys, privateKey,
  isMultiSignatureRegistration, publicKey, moduleAssetId, rawTransaction,
) => {
  /**
   * Use Lisk Element to Sign with Private Key
   */
  let signedTransaction = transactions.signMultiSignatureTransactionWithPrivateKey(
    schema,
    transaction,
    networkIdentifier,
    Buffer.from(privateKey, 'hex'),
    {
      optionalKeys: keys.optionalKeys.map(convertStringToBinary),
      mandatoryKeys: keys.mandatoryKeys.map(convertStringToBinary),
    },
    isMultiSignatureRegistration,
  );

  /**
   * Define keys. Since we are creating the tx
   * The keys only exist for MultisigReg
   */
  const transactionKeys = {
    mandatoryKeys: rawTransaction.mandatoryKeys ?? [],
    optionalKeys: rawTransaction.optionalKeys ?? [],
  };

  /**
   * Check if the tx is multisigReg
   */
  const needsDoubleSign = [
    ...transactionKeys.mandatoryKeys,
    ...transactionKeys.optionalKeys,
  ].includes(publicKey);

  if (isMultiSignatureRegistration && needsDoubleSign) {
    /**
     * we have to transform, then flatten
     * then create txObject, convert to Buffer
     */
    const transformedTransaction = transformTransaction(signedTransaction);
    const flattenedTransaction = flattenTransaction(transformedTransaction);
    const tx = createTransactionObject(flattenedTransaction, moduleAssetId);
    const transactionKeysInBinary = {
      mandatoryKeys: transactionKeys.mandatoryKeys.map(convertStringToBinary),
      optionalKeys: transactionKeys.optionalKeys.map(convertStringToBinary),
    };

    /**
     * Use Lisk Element to Sign with Private Key
     */
    signedTransaction = transactions.signMultiSignatureTransactionWithPrivateKey(
      schema,
      tx,
      networkIdentifier,
      Buffer.from(privateKey, 'hex'),
      transactionKeysInBinary,
      isMultiSignatureRegistration,
    );
  }

  return signedTransaction;
};

const signUsingPrivateKey = (schema, transaction, networkIdentifier, privateKey) =>
  transactions.signTransactionWithPrivateKey(
    schema,
    transaction,
    networkIdentifier,
    Buffer.from(privateKey, 'hex'),
  );

const signUsingHW = async (schema, transaction, account, networkIdentifier, network) => {
  const signingBytes = transactions.getSigningBytes(schema, transaction);
  const [error, signedTransaction] = await to(signTransactionByHW(
    account,
    networkIdentifier,
    transaction,
    signingBytes,
  ));
  if (error) {
    throw error;
  }
  const id = computeTransactionId({ transaction: signedTransaction, network });
  return { ...signedTransaction, id };
};

export const sign = async (
  account, schema, transaction, network, networkIdentifier,
  isMultisignature, isMultiSignatureRegistration, keys, publicKey,
  moduleAssetId, rawTransaction, privateKey,
) => {
  if (!isEmpty(account.hwInfo)) {
    const signedTx = await signUsingHW(schema, transaction, account, networkIdentifier, network);
    return signedTx;
  }
  if (isMultisignature || isMultiSignatureRegistration) {
    return signMultisigUsingPrivateKey(
      schema, transaction, networkIdentifier, keys, privateKey,
      isMultiSignatureRegistration, publicKey, moduleAssetId, rawTransaction,
    );
  }
  return signUsingPrivateKey(schema, transaction, networkIdentifier, privateKey);
};

/**
 * Signs a given multisignature tx with a given passphrase
 *
 * @param {Object} transaction - Transaction object to be signed
 * @param {String} passphrase - Account passphrase to use for signing
 * @param {String} networkIdentifier - Current network identifier (from Redux store)
 * @param {Object} senderAccount
 * @param {Object} senderAccount.data - Details of the account who has initiated the transaction
 * @param {Boolean} isFullySigned - Is the tx object fully signed?
 *
 * @returns [Object, Object] - Signed transaction and err
 */
// eslint-disable-next-line max-statements
const signTransaction = async (
  transaction,
  account,
  _,
  senderAccount,
  txStatus,
  network,
) => {
  /**
   * Define keys.
   * Since the sender is different, the keys are defined based on that
   */
  const isGroupRegistration = transaction.moduleAssetId
    === MODULE_ASSETS_NAME_ID_MAP.registerMultisignatureGroup;
  const schema = network.networks.LSK.moduleAssetSchemas[transaction.moduleAssetId];
  const networkIdentifier = Buffer.from(network.networks.LSK.networkIdentifier, 'hex');

  const { mandatoryKeys, optionalKeys } = getKeys({
    senderAccount: senderAccount.data, transaction, isGroupRegistration,
  });
  const keys = {
    mandatoryKeys: mandatoryKeys.map(key => Buffer.from(key, 'hex')),
    optionalKeys: optionalKeys.map(key => Buffer.from(key, 'hex')),
  };

  /**
   * To do so, we have to  flatten, then create txObject
   */
  const flatTransaction = flattenTransaction(transaction);
  const transactionObject = createTransactionObject(flatTransaction, transaction.moduleAssetId);

  /**
   * remove excess optional signatures
   */
  if (txStatus === signatureCollectionStatus.occupiedByOptionals) {
    transactionObject.signatures = removeExcessSignatures(
      transactionObject.signatures, keys.mandatoryKeys.length, isGroupRegistration,
    );
  }

  try {
    const result = await sign(
      account, schema, transactionObject, network, networkIdentifier,
      !!senderAccount.data, isGroupRegistration, keys, account.summary.publicKey,
      transaction.moduleAssetId, flatTransaction, account.summary.privateKey,
    );
    return [result];
  } catch (e) {
    return [null, e];
  }
};

/**
 * Determines the number of signatures required for a transactions to be fully signed.
 * Note that the account passed must tbe sender account info. So for all types of txs, you
 * can get it from the Redux store. but for signing another account's tx, you should
 * make an API call using transaction.senderPublicKey to get the account info.
 *
 * @param {object} account - Sender account info
 * @param {object} transaction - Transaction object which should include the signatures property.
 * @returns {number} the number of signatures required
 */
const getNumberOfSignatures = (account, transaction) => {
  if (transaction?.moduleAssetId === MODULE_ASSETS_NAME_ID_MAP.registerMultisignatureGroup) {
    return transaction.optionalKeys.length + transaction.mandatoryKeys.length + 1;
  }
  if (account?.summary?.isMultisignature) {
    return account.keys.numberOfSignatures;
  }
  return DEFAULT_NUMBER_OF_SIGNATURES;
};

export {
  getTxAmount,
  downloadJSON,
  transactionToJSON,
  flattenTransaction,
  transformTransaction,
  containsTransactionType,
  createTransactionObject,
  normalizeTransactionParams,
  signTransaction,
  getNumberOfSignatures,
};
