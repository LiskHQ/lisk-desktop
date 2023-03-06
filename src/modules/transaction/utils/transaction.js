/* eslint-disable complexity */
/* eslint-disable max-lines */
import { transactions, cryptography, codec } from '@liskhq/lisk-client';
import { to } from 'await-to-js';
import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import { DEFAULT_NUMBER_OF_SIGNATURES } from '@transaction/configuration/transactions';
import { signatureCollectionStatus } from '@transaction/configuration/txStatus';
import { getTransactionSignatureStatus } from '@wallet/components/signMultisigView/helpers';
import { getKeys } from '@wallet/utils/account';
import { transformStringDateToUnixTimestamp } from 'src/utils/dateTime';
import { toRawLsk } from '@token/fungible/utils/lsk';
import { signTransactionByHW } from './hwManager';
import { fromTransactionJSON } from './encoding';
import { joinModuleAndCommand } from './moduleCommand';

const { transfer, stake, reclaim, registerMultisignature } = MODULE_COMMANDS_NAME_MAP;

// @todo import the following 4 values from lisk-elements (#4497)
const ED25519_PUBLIC_KEY_LENGTH = 32;
export const MESSAGE_TAG_MULTISIG_REG = 'LSK_RMSG_';
const multisigRegMsgSchema = {
  $id: '/auth/command/regMultisigMsg',
  type: 'object',
  required: ['address', 'nonce', 'numberOfSignatures', 'mandatoryKeys', 'optionalKeys'],
  properties: {
    address: {
      dataType: 'bytes',
      fieldNumber: 1,
      minLength: cryptography.constants.BINARY_ADDRESS_LENGTH,
      maxLength: cryptography.constants.BINARY_ADDRESS_LENGTH,
    },
    nonce: {
      dataType: 'uint64',
      fieldNumber: 2,
    },
    numberOfSignatures: {
      dataType: 'uint32',
      fieldNumber: 3,
    },
    mandatoryKeys: {
      type: 'array',
      items: {
        dataType: 'bytes',
        minLength: ED25519_PUBLIC_KEY_LENGTH,
        maxLength: ED25519_PUBLIC_KEY_LENGTH,
      },
      fieldNumber: 4,
    },
    optionalKeys: {
      type: 'array',
      items: {
        dataType: 'bytes',
        minLength: ED25519_PUBLIC_KEY_LENGTH,
        maxLength: ED25519_PUBLIC_KEY_LENGTH,
      },
      fieldNumber: 5,
    },
  },
};

export const convertStringToBinary = (value) => Buffer.from(value, 'hex');
export const convertBinaryToString = (value) => {
  if (value instanceof Uint8Array) {
    return Buffer.from(value).toString('hex');
  }
  return value.toString('hex');
};

const isBufferArray = (arr) =>
  arr.every((element) => {
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
    if (key === 'stakes') {
      obj[key] = value.map((item) => convertObjectToHex(item));
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

const containsTransactionType = (txs = [], type) => txs.some((tx) => tx.moduleCommand === type);

/**
 * Adapts transaction filter params to match transactions API method
 *
 * @param {Object} params - Params received from withFilters HOC
 * @returns {Object} - Parameters consumable by transaction API method
 */
const normalizeTransactionParams = (params) =>
  // eslint-disable-next-line complexity
  Object.keys(params).reduce((acc, item) => {
    switch (item) {
      case 'dateFrom':
        if (params[item]) {
          if (!acc.timestamp) acc.timestamp = ':';
          acc.timestamp = acc.timestamp.replace(
            /(\d+)?:/,
            `${transformStringDateToUnixTimestamp(params[item])}:`
          );
        }
        break;
      case 'dateTo':
        if (params[item]) {
          if (!acc.timestamp) acc.timestamp = ':';
          // We add 86400 so the range is inclusive
          acc.timestamp = acc.timestamp.replace(
            /:(\d+)?/,
            `:${transformStringDateToUnixTimestamp(params[item]) + 86400}`
          );
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
const getTxAmount = ({ module, command, params = {}, moduleCommand }) => {
  if (!moduleCommand) {
    moduleCommand = joinModuleAndCommand({ module, command });
  }
  if (moduleCommand === transfer || moduleCommand === reclaim) {
    return params.amount;
  }

  if (moduleCommand === stake) {
    return params.stakes.reduce((sum, stakeObject) => sum + Number(stakeObject.amount), 0);
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
  return cryptography.utils.hash(transactionBytes);
};

const signMultisigUsingPrivateKey = (schema, chainID, transaction, privateKey, senderAccount) => {
  const keys = getKeys({
    senderAccount,
    transaction,
    isRegisterMultisignature: false,
  });

  const signedTransaction = transactions.signMultiSignatureTransactionWithPrivateKey(
    transaction,
    Buffer.from(chainID, 'hex'),
    Buffer.from(privateKey, 'hex'),
    {
      optionalKeys: keys.optionalKeys.map(convertStringToBinary),
      mandatoryKeys: keys.mandatoryKeys.map(convertStringToBinary),
    },
    schema
  );

  return signedTransaction;
};

const signMultisigRegParams = (chainIDBuffer, transaction, privateKeyBuffer) => {
  const message = {
    mandatoryKeys: transaction.params.mandatoryKeys,
    optionalKeys: transaction.params.optionalKeys,
    numberOfSignatures: transaction.params.numberOfSignatures,
    address: cryptography.address.getAddressFromPublicKey(transaction.senderPublicKey),
    nonce: transaction.nonce,
  };

  const data = codec.codec.encode(multisigRegMsgSchema, message);
  return cryptography.ed.signData(MESSAGE_TAG_MULTISIG_REG, chainIDBuffer, data, privateKeyBuffer);
};

// eslint-disable-next-line max-statements
const signUsingPrivateKey = (wallet, schema, chainID, transaction, privateKey) => {
  const moduleCommand = joinModuleAndCommand(transaction);
  const isGroupRegistration = moduleCommand === registerMultisignature;
  const chainIDBuffer = Buffer.from(chainID, 'hex');
  const privateKeyBuffer = privateKey ? Buffer.from(privateKey, 'hex') : Buffer.alloc(0);
  const publicKeyBuffer = Buffer.from(wallet.summary.publicKey, 'hex');

  // Sign the params if tx is a group registration and the current account is a member
  if (isGroupRegistration) {
    const members = [
      ...transaction.params.mandatoryKeys.sort((publicKeyA, publicKeyB) =>
        publicKeyA.compare(publicKeyB)
      ),
      ...transaction.params.optionalKeys.sort((publicKeyA, publicKeyB) =>
        publicKeyA.compare(publicKeyB)
      ),
    ];

    const senderIndex = members.findIndex((item) => Buffer.compare(item, publicKeyBuffer) === 0);

    if (senderIndex > -1) {
      const memberSignature = signMultisigRegParams(chainIDBuffer, transaction, privateKeyBuffer);
      // @todo use correct index once SDK exposes the sort endpoint (#4497)
      const signatures = [...Array(members.length).keys()].map((index) => {
        if (index === senderIndex) return memberSignature;

        if (!transaction.params.signatures[index] || !transaction.params.signatures[index].length) {
          return Buffer.alloc(64);
        }
        return transaction.params.signatures[index];
      });
      transaction.params.signatures = signatures;
    }
  }

  // Sign the tx only if the account is the initiator of the tx

  const { mandatoryKeys, optionalKeys, numberOfSignatures } = wallet.keys;
  const isSender = Buffer.compare(transaction.senderPublicKey, publicKeyBuffer) === 0;
  const multiSigStatus = getTransactionSignatureStatus(
    {
      mandatoryKeys,
      optionalKeys,
      numberOfSignatures,
    },
    transaction
  );
  if (
    (isSender && isGroupRegistration && multiSigStatus === signatureCollectionStatus.fullySigned) ||
    (isSender && !isGroupRegistration)
  ) {
    try {
      const res = transactions.signTransactionWithPrivateKey(
        transaction,
        chainIDBuffer,
        privateKeyBuffer,
        schema
      );

      return res;
    } catch (e) {
      return e;
    }
  }
  return transaction;
};

// eslint-disable-next-line max-statements
const signUsingHW = async (wallet, schema, chainID, transaction) => {
  const [error, signedTransaction] = await to(
    signTransactionByHW({ wallet, chainID, transaction, schema })
  );

  if (error) {
    throw error;
  }

  const id = computeTransactionId({ transaction: signedTransaction, schema });
  return { ...signedTransaction, id };
};

export const sign = async (wallet, schema, chainID, transaction, privateKey, senderAccount) => {
  if (wallet.metadata?.isHW) {
    return signUsingHW(wallet, schema, chainID, transaction);
  }

  if (senderAccount.mandatoryKeys?.length + senderAccount.optionalKeys?.length > 0) {
    return signMultisigUsingPrivateKey(schema, chainID, transaction, privateKey, senderAccount);
  }

  return signUsingPrivateKey(wallet, schema, chainID, transaction, privateKey);
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
  transactionJSON,
  txStatus,
  schema,
  chainID,
  privateKey,
  txInitiatorAccount
) => {
  /**
   * Define keys.
   * Since the sender is different, the keys are defined based on that
   */
  const moduleCommand = joinModuleAndCommand(transactionJSON);
  const isRegisterMultisignature = moduleCommand === registerMultisignature;
  const keys = {
    mandatoryKeys: senderAccount.mandatoryKeys.map((key) => Buffer.from(key, 'hex')),
    optionalKeys: senderAccount.optionalKeys.map((key) => Buffer.from(key, 'hex')),
  };
  const transaction = fromTransactionJSON(transactionJSON, schema);

  /**
   * remove excess optional signatures
   */
  if (txStatus === signatureCollectionStatus.occupiedByOptionals) {
    transaction.signatures = removeExcessSignatures(
      transaction.signatures,
      keys.mandatoryKeys.length,
      isRegisterMultisignature
    );
  }

  try {
    const result = await sign(
      wallet,
      schema,
      chainID,
      transaction,
      privateKey,
      isRegisterMultisignature ? senderAccount : txInitiatorAccount
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
  if (account?.keys?.numberOfSignatures > 0) {
    return account.keys.numberOfSignatures;
  }
  const moduleCommand = joinModuleAndCommand(transaction);
  if (moduleCommand === registerMultisignature) {
    return transaction.params.optionalKeys.length + transaction.params.mandatoryKeys.length;
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
  };
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
  downloadJSON,
  transactionToJSON,
  containsTransactionType,
  normalizeTransactionParams,
  signMultisigTransaction,
  getNumberOfSignatures,
  normalizeTransactionsStatisticsParams,
  normalizeNumberRange,
};
