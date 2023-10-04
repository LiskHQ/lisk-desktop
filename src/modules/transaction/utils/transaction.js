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
import { convertToBaseDenom } from '@token/fungible/utils/helpers';
import { signTransactionByHW } from './hwManager';
import { fromTransactionJSON } from './encoding';
import { joinModuleAndCommand } from './moduleCommand';

const { transfer, transferCrossChain, stake, reclaimLSK, registerMultisignature } =
  MODULE_COMMANDS_NAME_MAP;

export const MESSAGE_TAG_MULTISIG_REG = 'LSK_RMSG_';

export const convertStringToBinary = (value) => Buffer.from(value, 'hex');
export const convertBinaryToString = (value) => {
  if (value instanceof Uint8Array) {
    return Buffer.from(value).toString('hex');
  }
  return value.toString('hex');
};

const containsTransactionType = (txs = [], type) => txs.some((tx) => tx.moduleCommand === type);

/**
 * Adapts transaction filter params to match transactions API method
 * @returns {Object} - Parameters consumable by transaction API method
 */
const normalizeTransactionParams = (params, token) =>
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
          acc.amount = acc.amount.replace(/(\d+)?:/, `${convertToBaseDenom(params[item], token)}:`);
        }
        break;
      case 'amountTo':
        if (params[item]) {
          if (!acc.amount) acc.amount = ':';
          acc.amount = acc.amount.replace(/:(\d+)?/, `:${convertToBaseDenom(params[item], token)}`);
        }
        break;
      default:
        acc[item] = params[item];
    }

    return acc;
  }, {});

/**
 * Get transaction amount in total for a given module command
 */
const getTransactionAmount = ({ module, command, params = {} }) => {
  const moduleCommand = joinModuleAndCommand({ module, command });

  if (Object.keys(params).length === 0) {
    return '0';
  }

  if (
    moduleCommand === transfer ||
    moduleCommand === transferCrossChain ||
    moduleCommand === reclaimLSK
  ) {
    return params.amount;
  }

  if (moduleCommand === stake) {
    return params.stakes
      .reduce((sum, stakeObject) => sum + BigInt(stakeObject.amount), BigInt(0))
      .toString();
  }

  return '0';
};

/* istanbul ignore next */
const downloadJSON = (data, name) => {
  const anchor = document.createElement('a');
  anchor.setAttribute(
    'href',
    `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data))}`
  );
  anchor.setAttribute('download', `${name}.json`);
  anchor.click();
};

/**
 * Removes the excess signatures from optional members
 * to open up room for the mandatory ones
 * @returns {array} the trimmed array of signatures
 */
const removeExcessSignatures = (signatures, mandatoryKeysNo, hasSenderSignature) => {
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

const getUnsignedBytes = (transaction, messageSchema) => {
  const message = {
    mandatoryKeys: transaction.params.mandatoryKeys,
    optionalKeys: transaction.params.optionalKeys,
    numberOfSignatures: transaction.params.numberOfSignatures,
    address: cryptography.address.getAddressFromPublicKey(transaction.senderPublicKey),
    nonce: transaction.nonce,
  };

  return codec.codec.encode(messageSchema, message);
};

const getAccountKeys = (account) => {
  const keys = {
    mandatoryKeys: account.mandatoryKeys
      .map((k) => (Buffer.isBuffer(k) ? k : Buffer.from(k, 'hex')))
      .sort((publicKeyA, publicKeyB) => publicKeyA.compare(publicKeyB)),
    optionalKeys: account.optionalKeys
      .map((k) => (Buffer.isBuffer(k) ? k : Buffer.from(k, 'hex')))
      .sort((publicKeyA, publicKeyB) => publicKeyA.compare(publicKeyB)),
  };

  return keys.mandatoryKeys.concat(keys.optionalKeys);
};

const insertSignature = (signatures, signature, accountKeys, currentAccountPubKey) => {
  for (let i = 0; i < accountKeys.length; i += 1) {
    if (accountKeys[i].equals(currentAccountPubKey)) {
      signatures[i] = signature;
    } else if (signatures[i] === undefined) {
      signatures[i] = Buffer.alloc(0);
    }
  }

  return signatures;
};

// eslint-disable-next-line max-statements
const signUsingPrivateKey = (wallet, schema, chainID, transaction, privateKey, options) => {
  const moduleCommand = joinModuleAndCommand(transaction);
  const isRegisterMultisignature = moduleCommand === registerMultisignature;
  const chainIDBuffer = Buffer.from(chainID, 'hex');
  const privateKeyBuffer = privateKey ? Buffer.from(privateKey, 'hex') : Buffer.alloc(0);
  const currentAccountPubKey = Buffer.from(wallet.summary.publicKey, 'hex');
  const areAllMembersSigned =
    isRegisterMultisignature &&
    transaction.params.signatures.filter(
      (sig) => sig.length !== 64 || Buffer.from(sig).equals(Buffer.alloc(64))
    ).length === 0 &&
    transaction.params.signatures.length ===
      transaction.params.mandatoryKeys.length + transaction.params.optionalKeys.length;

  // Sign the params if tx is a group registration and the current account is a member
  if (isRegisterMultisignature && !areAllMembersSigned) {
    const unsignedBytes = getUnsignedBytes(transaction, options.messageSchema);
    const signature = cryptography.ed.signData(
      MESSAGE_TAG_MULTISIG_REG,
      chainIDBuffer,
      unsignedBytes,
      privateKeyBuffer
    );
    const accountKeys = getAccountKeys(transaction.params);
    transaction.params.signatures = insertSignature(
      transaction.params.signatures,
      signature,
      accountKeys,
      currentAccountPubKey
    );
  }

  // Sign the tx only if the account is the initiator of the tx
  const { mandatoryKeys, optionalKeys, numberOfSignatures } = wallet.keys;
  const isSender = Buffer.compare(transaction.senderPublicKey, currentAccountPubKey) === 0;
  const multiSigStatus = getTransactionSignatureStatus(
    {
      mandatoryKeys,
      optionalKeys,
      numberOfSignatures,
    },
    transaction
  );
  if (
    (isSender &&
      isRegisterMultisignature &&
      multiSigStatus === signatureCollectionStatus.fullySigned) ||
    (isSender && !isRegisterMultisignature)
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
const signTransactionUsingHW = async (
  wallet,
  schema,
  chainID,
  transaction,
  senderAccount,
  options
) => {
  const [error, signedTransaction] = await to(
    signTransactionByHW({ wallet, chainID, transaction, schema, senderAccount, options })
  );

  if (error) {
    throw error;
  }

  const id = computeTransactionId({ transaction: signedTransaction, schema });
  return { ...signedTransaction, id };
};

export const sign = async (
  wallet,
  schema,
  chainID,
  transaction,
  privateKey,
  senderAccount,
  options
) => {
  if (wallet.metadata?.isHW) {
    return signTransactionUsingHW(wallet, schema, chainID, transaction, senderAccount, options);
  }

  if (options?.txInitiatorAccount?.numberOfSignatures > 0) {
    return signMultisigUsingPrivateKey(
      schema,
      chainID,
      transaction,
      privateKey,
      options?.txInitiatorAccount
    );
  }

  return signUsingPrivateKey(wallet, schema, chainID, transaction, privateKey, options);
};

/**
 * Signs a given multisignature tx with a given passphrase
 * This function is only called when account either trying to register or sign multisignature
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
  txInitiatorAccount,
  options
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
      isRegisterMultisignature ? txInitiatorAccount : senderAccount,
      options
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
 * @returns {Object} - Distribution data for chart
 */
const normalizeNumberRange = (distributions) => {
  const values = {
    '0.001_0.01': '0 - 10',
    '0.01_0.1': '0 - 10',
    '0.1_1': '0 - 10',
    '1_10': '0 - 10',
    '10_100': '11 - 100',
    '100_1000': '101 - 1000',
    '1000_10000': '1001 - 10,000',
    '10000_100000': '10,001 - 100,000',
    '100000_1000000': '100,001 - 1,000,000',
    '1000000_10000000': '1,000,001 - 10,000,000',
    '10000000_100000000': '10,000,001 - 100,000,000',
    '100000000_1000000000': '100,000,001 - 1,000,000,000',
  };
  return Object.keys(distributions).reduce((acc, item) => {
    acc[values[item]] = (acc[values[item]] || 0) + distributions[item];
    return acc;
  }, {});
};

export {
  containsTransactionType,
  downloadJSON,
  getTransactionAmount,
  getUnsignedBytes,
  getNumberOfSignatures,
  getAccountKeys,
  insertSignature,
  normalizeTransactionsStatisticsParams,
  normalizeNumberRange,
  normalizeTransactionParams,
  signMultisigTransaction,
};
