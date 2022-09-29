/* eslint-disable max-lines */
import { transactions, cryptography, codec } from '@liskhq/lisk-client';
import { to } from 'await-to-js';
import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import { DEFAULT_NUMBER_OF_SIGNATURES } from '@transaction/configuration/transactions';
import { signatureCollectionStatus } from '@transaction/configuration/txStatus';
import {
  extractAddressFromPublicKey,
  getBase32AddressFromAddress,
  getKeys,
} from '@wallet/utils/account';
import { transformStringDateToUnixTimestamp } from 'src/utils/dateTime';
import { toRawLsk } from '@token/fungible/utils/lsk';
import { isEmpty } from 'src/utils/helpers';
import { splitModuleAndCommand, joinModuleAndCommand } from './moduleCommand';
import { signTransactionByHW } from './hwManager';

const {
  transfer, voteDelegate, registerDelegate, unlock, reclaim, registerMultisignatureGroup,
} = MODULE_COMMANDS_NAME_MAP;

const EMPTY_BUFFER = Buffer.alloc(0);
export const convertStringToBinary = value => Buffer.from(value, 'hex');
export const convertBinaryToString = value => {
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

const getDesktopTxAsset = (elementsParams, moduleCommand) => {
  switch (moduleCommand) {
    case transfer: {
      return {
        data: elementsParams.data,
        amount: convertBigIntToString(elementsParams.amount),
        recipient: { address: getBase32AddressFromAddress(elementsParams.recipientAddress) },
      };
    }

    case registerDelegate: {
      return {
        username: elementsParams.username,
        generatorPublicKey: convertBinaryToString(elementsParams.generatorPublicKey),
        blsPublicKey: convertBinaryToString(elementsParams.blsPublicKey),
        proofOfPossession: convertBinaryToString(elementsParams.proofOfPossession),
      };
    }

    case voteDelegate: {
      return {
        votes: elementsParams.votes.map(vote => ({
          amount: convertBigIntToString(vote.amount),
          delegateAddress: getBase32AddressFromAddress(vote.delegateAddress),
        })),
      };
    }

    case reclaim: {
      return {
        amount: convertBigIntToString(elementsParams.amount),
      };
    }

    case unlock: {
      return {
        unlockObjects: elementsParams.unlockObjects.map(unlockObject => ({
          delegateAddress: getBase32AddressFromAddress(unlockObject.delegateAddress),
          amount: convertBigIntToString(unlockObject.amount),
          unvoteHeight: unlockObject.unvoteHeight,
        })),
      };
    }

    case registerMultisignatureGroup: {
      return {
        numberOfSignatures: elementsParams.numberOfSignatures,
        mandatoryKeys: elementsParams.mandatoryKeys.map(convertBinaryToString),
        optionalKeys: elementsParams.optionalKeys.map(convertBinaryToString),
      };
    }

    default:
      return Error('Unknown transaction');
  }
};

const getElementsTxParams = (desktopParams, moduleCommand) => {
  switch (moduleCommand) {
    case transfer: {
      console.log('desktopParams', desktopParams);
      const binaryAddress = desktopParams.recipient.address
        ? desktopParams.recipient.address : EMPTY_BUFFER;
      return {
        recipientAddress: binaryAddress,
        amount: desktopParams.amount,
        data: desktopParams.data,
        // TODO: desktopParams.token.tokenID was returning invalid value
        // We need remove the below value once we fix the desktopParams.token.tokenID 
        tokenID: '0000000000000000',
      };
    }

    case registerDelegate: {
      return {
        username: desktopParams.username,
        generatorPublicKey: desktopParams.generatorPublicKey,
        blsPublicKey: desktopParams.blsPublicKey,
        proofOfPossession: desktopParams.proofOfPossession,
      };
    }

    case voteDelegate: {
      return { votes: desktopParams.votes };
    }

    case unlock: {
      return {
        unlockObjects: desktopParams.unlockObjects,
      };
    }

    case reclaim: {
      return {
        amount: desktopParams.amount,
      };
    }

    case registerMultisignatureGroup: {
      return {
        numberOfSignatures: desktopParams.numberOfSignatures,
        mandatoryKeys: desktopParams.mandatoryKeys,
        optionalKeys: desktopParams.optionalKeys,
      };
    }

    default:
      return Error('Unknown transaction');
  }
};

const getElementsParamsFromJSON = (JSONParams, moduleCommand) => {
  switch (moduleCommand) {
    case transfer:
      return {
        recipientAddress: convertStringToBinary(JSONParams.recipientAddress),
        amount: BigInt(convertBigIntToString(JSONParams.amount)),
        data: JSONParams.data,
      };

    case voteDelegate: {
      const votes = JSONParams.votes.map(vote => ({
        amount: BigInt(convertBigIntToString(vote.amount)),
        delegateAddress: convertStringToBinary(vote.delegateAddress),
      }));
      return { votes };
    }

    case unlock: {
      return {
        unlockObjects: JSONParams.unlockObjects.map(unlockObject => ({
          amount: BigInt(convertBigIntToString(unlockObject.amount)),
          delegateAddress: convertStringToBinary(unlockObject.delegateAddress),
          unvoteHeight: unlockObject.unvoteHeight,
        })),
      };
    }

    case reclaim: {
      return {
        amount: BigInt((convertBigIntToString(JSONParams.amount))),
      };
    }

    case registerMultisignatureGroup: {
      return {
        numberOfSignatures: Number(JSONParams.numberOfSignatures),
        mandatoryKeys: JSONParams.mandatoryKeys.map(convertStringToBinary),
        optionalKeys: JSONParams.optionalKeys.map(convertStringToBinary),
      };
    }

    case registerDelegate:
      return {
        username: JSONParams.username,
        generatorPublicKey: convertStringToBinary(JSONParams.generatorPublicKey),
        blsPublicKey: convertStringToBinary(JSONParams.blsPublicKey),
        proofOfPossession: convertStringToBinary(JSONParams.proofOfPossession),
      };

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
  module, command, id, params, nonce, fee, senderPublicKey, signatures,
}) => {
  const moduleCommand = joinModuleAndCommand({ module, command });
  const senderAddress = extractAddressFromPublicKey(senderPublicKey);
  const transformedTransaction = {
    moduleCommand,
    id: id ? convertBinaryToString(id) : '',
    fee: convertBigIntToString(fee),
    nonce: convertBigIntToString(nonce),
    signatures: signatures.map(convertBinaryToString),
    sender: {
      address: senderAddress,
      publicKey: convertBinaryToString(senderPublicKey),
    },
  };

  transformedTransaction.params = getDesktopTxAsset(params, moduleCommand);
  return transformedTransaction;
};

/**
 * creates a transaction object to be used with the api client from
 * lisk elements
 * @param {object} tx - the transaction data
 * @param {string} moduleCommand - moduleCommand
 * @returns the transaction object
 */
const desktopTxToElementsTx = (tx, moduleCommand, schema) => {
  const [module, command] = splitModuleAndCommand(moduleCommand);
  const {
    sender, nonce, signatures = [], fee = 0, params,
  } = tx;

  const transaction = {
    module,
    command,
    senderPublicKey: convertStringToBinary(sender.publicKey),
    nonce: BigInt(nonce),
    fee: BigInt(fee),
    signatures: signatures.map(convertStringToBinary),
  };

  // TODO: Ideally the parameter conversion from JSON to JS Object and vice versa can now be handled with code directly
  // This below code is a patch, if we can construct the params JSON properly from each form then we can remove getElementsTxParams
  // and directly use codec.codec.fromJSON to convert JSON to JS Object and codec.codec.toJSON to get JSON from JS Object
  transaction.params = codec.codec.fromJSON(schema, getElementsTxParams(params, moduleCommand));
  console.log('transaction', transaction);
  return transaction;
};

const convertTxJSONToBinary = (tx) => {
  const transaction = {
    module: tx.module,
    command: tx.command,
    senderPublicKey: convertStringToBinary(tx.senderPublicKey),
    fee: BigInt(convertBigIntToString(tx.fee)),
    nonce: BigInt(convertBigIntToString(tx.nonce)),
    signatures: tx.signatures.map(convertStringToBinary),
    id: convertStringToBinary(tx.id),
  };

  transaction.params = getElementsParamsFromJSON(tx.params, joinModuleAndCommand(tx));
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
  txs.some(tx => tx.moduleCommand === type);

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
const getTxAmount = ({ moduleCommand, params }) => {
  if (moduleCommand === transfer || moduleCommand === reclaim) {
    return params.amount;
  }

  if (moduleCommand === unlock) {
    return params.unlockObjects.reduce((sum, unlockObject) =>
      sum + parseInt(unlockObject.amount, 10), 0);
  }
  if (moduleCommand === voteDelegate) {
    return params.votes.reduce((sum, vote) =>
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
export const computeTransactionId = ({ transaction, schema }) => {
  const transactionBytes = transactions.getBytes(transaction, schema);
  return  cryptography.utils.hash(transactionBytes);
};

const signMultisigUsingPrivateKey = (
  schema, chainID, transaction, moduleCommand, wallet, privateKey,
) => {
  const isMultisigReg = moduleCommand === registerMultisignatureGroup;
  const keys = isMultisigReg
    ? transaction.asset
    : wallet.keys;
  /**
   * Use Lisk Element to Sign with Private Key
   */
  const signedTransaction = transactions.signMultiSignatureTransactionWithPrivateKey(
    transaction,
    Buffer.from(chainID, 'hex'),
    Buffer.from(privateKey, 'hex'),
    {
      optionalKeys: keys.optionalKeys.map(convertStringToBinary),
      mandatoryKeys: keys.mandatoryKeys.map(convertStringToBinary),
    },
    schema,
    isMultisigReg,
  );

  /**
   * Check if the tx is multisigReg
   */
  const members = [
    ...transaction.asset.mandatoryKeys.sort(),
    ...transaction.asset.optionalKeys.sort(),
  ];
  const senderIndex = members.indexOf(wallet.summary.publicKey);
  const isSender = transaction.senderPublicKey === wallet.summary.publicKey;

  if (isMultisigReg && isSender && senderIndex > -1) {
    const signatures = Array.from(Array(members.length + 1).keys()).map((index) => {
      if (signedTransaction.signatures[index]) return signedTransaction.signatures[index];
      if (index === senderIndex + 1) return signedTransaction.signatures[0];
      return Buffer.from('');
    });
    signedTransaction.signatures = signatures;
  }

  return signedTransaction;
};

const signUsingPrivateKey = (schema, chainID, transaction, privateKey) => {
  const res = transactions.signTransactionWithPrivateKey(
    transaction,
    Buffer.from(chainID, 'hex'),
    Buffer.from(privateKey, 'hex'),
    schema,
  );
  return res;
};

// eslint-disable-next-line max-statements
const signUsingHW = async (
  schema, chainID, moduleCommand, transaction, wallet,
) => {
  const isMultisigReg = moduleCommand
    === MODULE_COMMANDS_NAME_MAP.registerMultisignatureGroup
  const transactionBytes = transactions.getSigningBytes(transaction, schema);
  const [error, signedTransaction] = await to(signTransactionByHW(
    wallet,
    chainID,
    transaction,
    transactionBytes,
  ));
  if (error) {
    throw error;
  }

  const members = [
    ...transaction.asset.mandatoryKeys.sort(),
    ...transaction.asset.optionalKeys.sort(),
  ];
  const senderIndex = members.indexOf(wallet.summary.publicKey);
  const isSender = transaction.senderPublicKey === wallet.summary.publicKey;

  if (isMultisigReg && isSender && senderIndex > -1) {
    const signatures = Array.from(Array(members.length + 1).keys()).map((index) => {
      if (signedTransaction.signatures[index]) return signedTransaction.signatures[index];
      if (index === senderIndex + 1) return signedTransaction.signatures[0];
      return Buffer.from('');
    });
    signedTransaction.signatures = signatures;
  }

  const id = computeTransactionId({ transaction: signedTransaction, schema });
  return { ...signedTransaction, id };
};

export const sign = async (
  wallet, schema, chainID, transaction,
  moduleCommand, privateKey,
) => {
  const isMultisigReg = moduleCommand
    === MODULE_COMMANDS_NAME_MAP.registerMultisignatureGroup

  // @todo rawTransaction is changed
  if (!isEmpty(wallet.hwInfo)) {
    const signedTx = await signUsingHW(
      schema, chainID, moduleCommand, transaction, wallet,
    );
    return signedTx;
  }
  if (wallet.summary.isMultisignature || isMultisigReg) {
    return signMultisigUsingPrivateKey(
      schema, chainID, transaction, moduleCommand, wallet, privateKey,
    );
  }

  return signUsingPrivateKey(schema, chainID, transaction, privateKey);
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
  wallet,
  senderAccount,
  transaction,
  txStatus,
  network,
  privateKey,
  chainID,
) => {
  /**
   * Define keys.
   * Since the sender is different, the keys are defined based on that
   */
  const isMultisigReg = transaction.moduleCommand === registerMultisignatureGroup;
  const schema = network.networks.LSK.moduleCommandSchemas[transaction.moduleCommand];

  const { mandatoryKeys, optionalKeys } = getKeys({
    senderAccount: senderAccount.data, transaction, isMultisigReg,
  });
  const keys = {
    mandatoryKeys: mandatoryKeys.map(key => Buffer.from(key, 'hex')),
    optionalKeys: optionalKeys.map(key => Buffer.from(key, 'hex')),
  };

  /**
   * To do so, we have to flatten, then create txObject
   */
  const transactionObject = desktopTxToElementsTx(transaction, transaction.moduleCommand);

  /**
   * remove excess optional signatures
   */
  if (txStatus === signatureCollectionStatus.occupiedByOptionals) {
    transactionObject.signatures = removeExcessSignatures(
      transactionObject.signatures, keys.mandatoryKeys.length, isMultisigReg,
    );
  }

  try {
    const result = await sign(
      wallet, schema, chainID, transactionObject,
      transaction.moduleCommand, privateKey,
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
const getNumberOfSignatures = ({ numberOfSignatures, isMultisignature }, transaction) => {
  if (transaction?.moduleCommand === registerMultisignatureGroup) {
    return transaction.params.optionalKeys.length + transaction.params.mandatoryKeys.length + 1;
  }
  if (isMultisignature) {
    return numberOfSignatures;
  }
  return DEFAULT_NUMBER_OF_SIGNATURES;
};

/**
 * Adapts transaction statistics params to match transactions statistics API method
 *
 * @param {Object} period - Period received from active tab
 * @returns {Object} - Parameters consumable by transaction statistics API method
 */
const normalizeTransactionsStatisticsParams = (period) => {
  const paramsConfig = {
    week: { interval: 'day', limit: 7 },
    month: { interval: 'month', limit: 6 },
    year: { interval: 'month', limit: 12 },
  }
  return paramsConfig[period];
};

/**
 * Adapts chart amount distributions to distribution displayed in chart
 *
 * @param {Object} distributions - Amount distribution
 * @returns {Object} - Distribution data for chart
 */
const normalizeNumberRange = (distributions) => {
  const values = {
    '0.001_0.01': '0 - 10 LSK',
    '0.01_0.1': '0 - 10 LSK',
    '0.1_1': '0 - 10 LSK',
    '1_10': '0 - 10 LSK',
    '10_100': '11 - 100 LSK',
    '100_1000': '101 - 1000 LSK',
    '1000_10000': '1001 - 10,000 LSK',
    '10000_100000': '10,001 - 100,000 LSK',
    '100000_1000000': '100,001 - 1,000,000 LSK',
    '1000000_10000000': '1,000,001 - 10,000,000 LSK',
    '10000000_100000000': '10,000,001 - 100,000,000 LSK',
    '100000000_1000000000': '100,000,001 - 1,000,000,000 LSK',
  };
  return Object.keys(distributions).reduce((acc, item) => {
    acc[values[item]] = (acc[values[item]] || 0) + distributions[item];
    return acc;
  }, {});
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
  normalizeTransactionsStatisticsParams,
  normalizeNumberRange,
};
