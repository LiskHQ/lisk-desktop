/* eslint-disable max-lines */
import { transactions, cryptography } from '@liskhq/lisk-client';
import { to } from 'await-to-js';
import { MODULE_ASSETS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import { DEFAULT_NUMBER_OF_SIGNATURES } from '@transaction/configuration/transactions';
import { signatureCollectionStatus } from '@transaction/configuration/txStatus';
import {
  extractAddressFromPublicKey,
  getBase32AddressFromAddress,
  getAddressFromBase32Address,
  getKeys,
} from '@wallet/utils/account';
import { transformStringDateToUnixTimestamp } from 'src/utils/dateTime';
import { toRawLsk } from '@token/fungible/utils/lsk';
import { isEmpty } from 'src/utils/helpers';
import { splitModuleAndAssetIds, joinModuleAndAssetIds } from './moduleAssets';
import { signTransactionByHW } from './hwManager';

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

const getDesktopTxAsset = (elementsAsset, moduleAssetId) => {
  switch (moduleAssetId) {
    case transfer: {
      return {
        data: elementsAsset.data,
        amount: convertBigIntToString(elementsAsset.amount),
        recipient: { address: getBase32AddressFromAddress(elementsAsset.recipientAddress) },
      };
    }

    case registerDelegate: {
      return {
        username: elementsAsset.username,
      };
    }

    case voteDelegate: {
      return {
        votes: elementsAsset.votes.map(vote => ({
          amount: convertBigIntToString(vote.amount),
          delegateAddress: getBase32AddressFromAddress(vote.delegateAddress),
        })),
      };
    }

    case reclaimLSK: {
      return {
        amount: convertBigIntToString(elementsAsset.amount),
      };
    }

    case unlockToken: {
      return {
        unlockObjects: elementsAsset.unlockObjects.map(unlockObject => ({
          delegateAddress: getBase32AddressFromAddress(unlockObject.delegateAddress),
          amount: convertBigIntToString(unlockObject.amount),
          unvoteHeight: unlockObject.unvoteHeight,
        })),
      };
    }

    case registerMultisignatureGroup: {
      return {
        numberOfSignatures: elementsAsset.numberOfSignatures,
        mandatoryKeys: elementsAsset.mandatoryKeys.map(convertBinaryToString),
        optionalKeys: elementsAsset.optionalKeys.map(convertBinaryToString),
      };
    }

    default:
      return Error('Unknown transaction');
  }
};

const getElementsTxAsset = (desktopAsset, moduleAssetId) => {
  switch (moduleAssetId) {
    case transfer: {
      const binaryAddress = desktopAsset.recipient.address
        ? getAddressFromBase32Address(desktopAsset.recipient.address) : EMPTY_BUFFER;

      return {
        recipientAddress: binaryAddress,
        amount: BigInt(desktopAsset.amount),
        data: desktopAsset.data,
      };
    }

    case registerDelegate: {
      return {
        username: desktopAsset.username,
      };
    }

    case voteDelegate: {
      const votes = desktopAsset.votes.map(vote => ({
        amount: BigInt(vote.amount),
        delegateAddress: getAddressFromBase32Address(vote.delegateAddress),
      }));
      return { votes };
    }

    case unlockToken: {
      return {
        unlockObjects: desktopAsset.unlockObjects.map(unlockObject => ({
          amount: BigInt(unlockObject.amount),
          delegateAddress: getAddressFromBase32Address(unlockObject.delegateAddress),
          unvoteHeight: unlockObject.unvoteHeight,
        })),
      };
    }

    case reclaimLSK: {
      return {
        amount: BigInt(desktopAsset.amount),
      };
    }

    case registerMultisignatureGroup: {
      return {
        numberOfSignatures: Number(desktopAsset.numberOfSignatures),
        mandatoryKeys: desktopAsset.mandatoryKeys.map(convertStringToBinary),
        optionalKeys: desktopAsset.optionalKeys.map(convertStringToBinary),
      };
    }

    default:
      return Error('Unknown transaction');
  }
};

const getElementsAssetFromJSON = (JSONAsset, moduleAssetId) => {
  switch (moduleAssetId) {
    case transfer:
      return {
        recipientAddress: convertStringToBinary(JSONAsset.recipientAddress),
        amount: BigInt(convertBigIntToString(JSONAsset.amount)),
        data: JSONAsset.data,
      };

    case voteDelegate: {
      const votes = JSONAsset.votes.map(vote => ({
        amount: BigInt(convertBigIntToString(vote.amount)),
        delegateAddress: convertStringToBinary(vote.delegateAddress),
      }));
      return { votes };
    }

    case unlockToken: {
      return {
        unlockObjects: JSONAsset.unlockObjects.map(unlockObject => ({
          amount: BigInt(convertBigIntToString(unlockObject.amount)),
          delegateAddress: convertStringToBinary(unlockObject.delegateAddress),
          unvoteHeight: unlockObject.unvoteHeight,
        })),
      };
    }

    case reclaimLSK: {
      return {
        amount: BigInt((convertBigIntToString(JSONAsset.amount))),
      };
    }

    case registerMultisignatureGroup: {
      return {
        numberOfSignatures: Number(JSONAsset.numberOfSignatures),
        mandatoryKeys: JSONAsset.mandatoryKeys.map(convertStringToBinary),
        optionalKeys: JSONAsset.optionalKeys.map(convertStringToBinary),
      };
    }

    case registerDelegate:
      return JSONAsset;

    default:
      return Error('Unknown transaction');
  }
};

/**
 * Converts a transaction returned by lisk elements back to the signature
 * used by lisk desktop
 *
 * @param {object} transaction - the transaction object
 * @returns the transformed transaction
 */
const elementTxToDesktopTx = ({
  moduleID, assetID, id, asset, nonce, fee, senderPublicKey, signatures,
}) => {
  const moduleAssetId = joinModuleAndAssetIds({ moduleID, assetID });
  const senderAddress = extractAddressFromPublicKey(senderPublicKey);
  const transformedTransaction = {
    moduleAssetId,
    id: id ? convertBinaryToString(id) : '',
    fee: convertBigIntToString(fee),
    nonce: convertBigIntToString(nonce),
    signatures: signatures.map(convertBinaryToString),
    sender: {
      address: senderAddress,
      publicKey: convertBinaryToString(senderPublicKey),
    },
  };

  transformedTransaction.asset = getDesktopTxAsset(asset, moduleAssetId);
  return transformedTransaction;
};

/**
 * creates a transaction object to be used with the api client from
 * lisk elements
 * @param {object} tx - the transaction data
 * @param {string} moduleAssetId - moduleAssetId
 * @returns the transaction object
 */
const desktopTxToElementsTx = (tx, moduleAssetId) => {
  const [moduleID, assetID] = splitModuleAndAssetIds(moduleAssetId);
  const {
    sender, nonce, signatures = [], fee = 0, asset,
  } = tx;

  const transaction = {
    moduleID,
    assetID,
    senderPublicKey: convertStringToBinary(sender.publicKey),
    nonce: BigInt(nonce),
    fee: BigInt(fee),
    signatures: signatures.map(convertStringToBinary),
  };

  transaction.asset = getElementsTxAsset(asset, moduleAssetId);
  return transaction;
};

const convertTxJSONToBinary = (tx) => {
  const transaction = {
    moduleID: tx.moduleID,
    assetID: tx.assetID,
    senderPublicKey: convertStringToBinary(tx.senderPublicKey),
    fee: BigInt(convertBigIntToString(tx.fee)),
    nonce: BigInt(convertBigIntToString(tx.nonce)),
    signatures: tx.signatures.map(convertStringToBinary),
    id: convertStringToBinary(tx.id),
  };

  transaction.asset = getElementsAssetFromJSON(tx.asset, joinModuleAndAssetIds(tx));
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
  isMultiSignatureRegistration, publicKey, rawTransaction,
) => {
  /**
   * Use Lisk Element to Sign with Private Key
   */
  const signedTransaction = transactions.signMultiSignatureTransactionWithPrivateKey(
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
  const members = [
    ...transactionKeys.mandatoryKeys.sort(),
    ...transactionKeys.optionalKeys.sort(),
  ];
  const senderIndex = members.indexOf(publicKey);
  const isSender = rawTransaction.senderPublicKey === publicKey;

  if (isMultiSignatureRegistration && isSender && senderIndex > -1) {
    const signatures = Array.from(Array(members.length + 1).keys()).map((index) => {
      if (signedTransaction.signatures[index]) return signedTransaction.signatures[index];
      if (index === senderIndex + 1) return signedTransaction.signatures[0];
      return Buffer.from('');
    });
    signedTransaction.signatures = signatures;
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

// eslint-disable-next-line max-statements
const signUsingHW = async (
  schema, transaction, wallet, networkIdentifier, network, keys, rawTransaction,
  isMultiSignatureRegistration,
) => {
  const signingBytes = transactions.getSigningBytes(schema, transaction);
  const [error, signedTransaction] = await to(signTransactionByHW(
    wallet,
    networkIdentifier,
    transaction,
    signingBytes,
    keys,
  ));
  if (error) {
    throw error;
  }

  const transactionKeys = {
    mandatoryKeys: rawTransaction.mandatoryKeys ?? [],
    optionalKeys: rawTransaction.optionalKeys ?? [],
  };

  const members = [
    ...transactionKeys.mandatoryKeys.sort(),
    ...transactionKeys.optionalKeys.sort(),
  ];
  const senderIndex = members.indexOf(wallet.summary.publicKey);
  const isSender = rawTransaction.senderPublicKey === wallet.summary.publicKey;

  if (isMultiSignatureRegistration && isSender && senderIndex > -1) {
    const signatures = Array.from(Array(members.length + 1).keys()).map((index) => {
      if (signedTransaction.signatures[index]) return signedTransaction.signatures[index];
      if (index === senderIndex + 1) return signedTransaction.signatures[0];
      return Buffer.from('');
    });
    signedTransaction.signatures = signatures;
  }

  const id = computeTransactionId({ transaction: signedTransaction, network });
  return { ...signedTransaction, id };
};

export const sign = async (
  wallet, schema, transaction, network, networkIdentifier,
  isMultisignature, isMultiSignatureRegistration, keys, publicKey,
  moduleAssetId, rawTransaction, privateKey,
) => {
  if (isMultiSignatureRegistration) {
    keys.optionalKeys = transaction.asset.optionalKeys;
    keys.mandatoryKeys = transaction.asset.mandatoryKeys;
  }
  // @todo rawTransaction is changed
  if (!isEmpty(wallet.hwInfo)) {
    const signedTx = await signUsingHW(
      schema, transaction, wallet, networkIdentifier, network, keys, rawTransaction,
      isMultiSignatureRegistration,
    );
    return signedTx;
  }
  if (isMultisignature || isMultiSignatureRegistration) {
    return signMultisigUsingPrivateKey(
      schema, transaction, networkIdentifier, keys, privateKey,
      isMultiSignatureRegistration, publicKey, rawTransaction,
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
const signMultisigTransaction = async (
  transaction,
  account,
  senderAccount,
  txStatus,
  network,
  privateKey,
  publicKey,
) => {
  /**
   * Define keys.
   * Since the sender is different, the keys are defined based on that
   */
  const isGroupRegistration = transaction.moduleAssetId === registerMultisignatureGroup;
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
   * To do so, we have to flatten, then create txObject
   */
  const transactionObject = desktopTxToElementsTx(transaction, transaction.moduleAssetId);

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
      !!senderAccount.data, isGroupRegistration, keys, privateKey ?? account.summary.publicKey,
      transaction.moduleAssetId, transaction, publicKey ?? account.summary.privateKey,
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
  if (transaction?.moduleAssetId === registerMultisignatureGroup) {
    return transaction.asset.optionalKeys.length + transaction.asset.mandatoryKeys.length + 1;
  }
  if (account?.summary?.isMultisignature) {
    return account.keys.numberOfSignatures;
  }
  return DEFAULT_NUMBER_OF_SIGNATURES;
};

export {
  getTxAmount,
  convertTxJSONToBinary,
  downloadJSON,
  transactionToJSON,
  elementTxToDesktopTx,
  containsTransactionType,
  desktopTxToElementsTx,
  normalizeTransactionParams,
  signMultisigTransaction,
  getNumberOfSignatures,
};
