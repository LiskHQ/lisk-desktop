/* eslint-disable max-lines */
import { transactions, cryptography } from '@liskhq/lisk-client';

import {
  loginTypes,
  tokenMap,
  MIN_FEE_PER_BYTE,
  DEFAULT_NUMBER_OF_SIGNATURES,
  MODULE_ASSETS_MAP,
  MODULE_ASSETS_NAME_ID_MAP,
  moduleAssetSchemas,
  BASE_FEES,
} from '@constants';
import { joinModuleAndAssetIds } from '@utils/moduleAssets';
import { signTransactionByHW } from '@utils/hwManager';
import {
  createTransactionObject, convertStringToBinary, transformTransaction, flattenTransaction,
} from '@utils/transaction';
import result from '@screens/multiSignature/result/index';
import { validateAddress } from '../../validators';
import http from '../http';
import { getDelegates } from '../delegate';
import { fromRawLsk } from '../../lsk';

const httpPrefix = '/api/v2';

const httpPaths = {
  fees: `${httpPrefix}/fees`,
  transactions: `${httpPrefix}/transactions`,
  transaction: `${httpPrefix}/transactions`,
  transactionStats: `${httpPrefix}/transactions/statistics`,
  schemas: `${httpPrefix}/transactions/schemas`,
};

/**
 * Retrieves the details of a single transaction
 *
 * @param {Object} data
 * @param {String} data.params
 * @param {String} data.params.id - Id of the transaction
 * @param {String?} data.baseUrl - Lisk Service API url to override the
 * existing ServiceUrl on the network param. We may use this to retrieve
 * the details of an archived transaction.
 * @param {Object} data.network - Network setting from Redux store
 * @returns {Promise} Transaction details API call
 */
export const getTransaction = ({
  params, network, baseUrl,
}) => http({
  path: httpPaths.transaction,
  params,
  network,
  baseUrl,
});

const filters = {
  address: { key: 'address', test: address => !validateAddress(tokenMap.LSK.key, address) },
  senderAddress: { key: 'senderAddress', test: address => !validateAddress(tokenMap.LSK.key, address) },
  recipientAddress: { key: 'recipientAddress', test: address => !validateAddress(tokenMap.LSK.key, address) },
  timestamp: { key: 'timestamp', test: str => /^(\d+)?:(\d+)?$/.test(str) },
  amount: { key: 'amount', test: str => /^(\d+)?:(\d+)?$/.test(str) },
  limit: { key: 'limit', test: num => parseInt(num, 10) > 0 },
  offset: { key: 'offset', test: num => parseInt(num, 10) >= 0 },
  moduleAssetId: { key: 'moduleAssetId', test: str => /\d:\d/.test(str) },
  height: { key: 'height', test: num => parseInt(num, 10) > 0 },
  blockId: { key: 'blockId', test: str => typeof str === 'string' },
  sort: {
    key: 'sort',
    test: str => ['amount:asc', 'amount:desc', 'fee:asc', 'fee:desc', 'timestamp:asc', 'timestamp:desc'].includes(str),
  },
};

/**
 * Retrieves the list of transactions for given parameters
 *
 * @param {Object} data
 * @param {Object} data.network - Network setting from Redux store
 * @param {String?} data.baseUrl - Lisk Service API url to override the
 * existing ServiceUrl on the network param. We may use this to retrieve
 * the details of an archived transaction.
 * @param {Object} data.params
 * @param {String} data.params.blockId The id of the block in which txs are included
 * @param {String} data.params.address Sender or recipient account
 * @param {String} data.params.dateFrom Unix timestamp, the start time of txs
 * @param {String} data.params.dateTo Unix timestamp, the end time of txs
 * @param {String} data.params.amountFrom The minimum value of txs
 * @param {String} data.params.amountTo The maximum value of txs
 * @param {String} data.params.moduleAssetId The moduleAssetId. 2:0, 5:1, etc
 * @param {Number} data.params.offset Used for pagination
 * @param {Number} data.params.limit Used for pagination
 * @param {String} data.params.sort an option of 'amount:asc',
 * 'amount:desc', 'timestamp:asc', 'timestamp:desc',
 * @param {Object} data.params.height The height of the block whose transaction we want.
 * If passed, all other parameter will be ignored.
 * @returns {Promise} Transactions list API call
 */
export const getTransactions = ({
  network,
  params,
  baseUrl,
}) => {
  const normParams = {};
  // Validate params and fix keys
  Object.keys(params).forEach((key) => {
    if (filters[key] && filters[key].test(params[key])) {
      normParams[filters[key].key] = params[key];
    } else {
      // eslint-disable-next-line no-console
      console.log(`getTransactions: Dropped ${key} parameter, it's invalid.`, params[key]);
    }
  });

  return http({
    network,
    path: httpPaths.transactions,
    params: normParams,
    baseUrl,
  });
};

/**
 * Fetches and generates an array of monthly number of delegate
 * registrations on Lisk blockchain.
 *
 * @param {Object} Network - Network setting from Redux store
 * @returns {Promise} Registered delegates list API call
 */
export const getRegisteredDelegates = async ({ network }) => {
  const delegates = await getDelegates({
    network,
    params: { limit: 1 },
  });
  const txs = await getTransactions({
    network,
    params: { moduleAssetId: '5:0', limit: 100 },
  });

  if (delegates.error || txs.error) {
    return Error('Error fetching data.');
  }

  const getDate = (timestamp) => {
    const d = new Date(timestamp * 1000);
    return `${new Date(d).getFullYear()}-${new Date(d).getMonth() + 1}`;
  };

  // create monthly number of registration as a dictionary
  const monthStats = txs.data
    .map(tx => tx.block.timestamp)
    .reduce((acc, timestamp) => {
      const date = getDate(timestamp);
      acc[date] = typeof acc[date] === 'number' ? acc[date] + 1 : 1;
      return acc;
    }, {});

  // Create a sorted array of monthly accumulated number of registrations
  const res = Object.keys(monthStats)
    .sort((a, b) => -1 * (b - 1))
    .reduce((acc, month) => {
      if (acc[0][0] === month) {
        acc.unshift([null, acc[0][1] - monthStats[month]]);
      } else if (acc[0][0] === null) {
        acc[0][0] = month;
        acc.unshift([null, acc[0][1] - monthStats[month]]);
      }

      return acc;
    }, [[getDate(txs.data[0].block.timestamp), delegates.meta.total]]);

  // Add the date of one month before the last tx
  res[0][0] = getDate(txs.data[txs.data.length - 1].block.timestamp - 2670000);

  return res;
};

/**
 * Retrieves the overall statistics of network transactions.
 *
 * @param {Object} data
 * @param {Object} data.params
 * @param {String} data.params.period - An option of 'day' or 'month'
 * @param {Number} data.params.limit - The number of results
 * @param {Object} data.network - Network setting from Redux store
 * @returns {Object} Network transactions statistics
 */
export const getTransactionStats = ({ network, params: { period } }) => {
  const normParams = {
    week: { path: 'day', limit: 7 },
    month: { path: 'month', limit: 6 },
    year: { path: 'month', limit: 12 },
  };

  return http({
    path: `${httpPaths.transactionStats}/${normParams[period].path}`,
    params: { limit: normParams[period].limit },
    network,
  });
};

/**
 * Retrieves transaction schemas.
 *
 * @param {Object} data
 * @param {String?} data.baseUrl - Lisk Service API url to override the
 * existing ServiceUrl on the network param. We may use this to retrieve
 * the details of an archived transaction.
 * @param {Object} data.network - Network setting from Redux store
 * @returns {Promise} http call
 */
export const getSchemas = ({ baseUrl }) => http({
  path: httpPaths.schemas,
  baseUrl,
});

/**
 * Returns a dictionary of base fees for low, medium and high processing speeds
 * @returns {Promise<{Low: number, Medium: number, High: number}>} with low,
 * medium and high priority fee options
 */
export const getTransactionBaseFees = network =>
  http({
    path: httpPaths.fees,
    searchParams: {},
    network,
  })
    .then((response) => {
      const { feeEstimatePerByte } = response.data;

      return {
        Low: feeEstimatePerByte.low,
        Medium: feeEstimatePerByte.medium,
        High: feeEstimatePerByte.high,
      };
    });

/**
 * Returns the actual tx fee based on given tx details
 * and selected processing speed
 *
 * @param {String} txData - The transaction object
 * @param {Object} selectedPriority - network configuration
 * @returns {Promise} Object containing value, error and feedback
 */
// eslint-disable-next-line max-statements
export const getTransactionFee = async ({
  transaction, selectedPriority, account, numberOfSignatures = DEFAULT_NUMBER_OF_SIGNATURES,
}) => {
  const feePerByte = selectedPriority.value;

  const {
    moduleAssetId, ...rawTransaction
  } = transaction;
  const schema = moduleAssetSchemas[moduleAssetId];
  const maxAssetFee = MODULE_ASSETS_MAP[moduleAssetId].maxFee;
  const transactionObject = createTransactionObject(rawTransaction, moduleAssetId);
  let numberOfEmptySignatures;

  if (moduleAssetId === MODULE_ASSETS_NAME_ID_MAP.registerMultisignatureGroup) {
    const { optionalKeys, mandatoryKeys } = transaction;
    numberOfSignatures = optionalKeys.length + mandatoryKeys.length + 1;
  } else if (account?.summary?.isMultisignature) {
    numberOfEmptySignatures = account.keys.members.length - numberOfSignatures;
  }

  const minFee = transactions.computeMinFee(schema, transactionObject, {
    baseFees: BASE_FEES,
    numberOfSignatures,
    numberOfEmptySignatures,
  });

  // tie breaker is only meant for medium and high processing speeds
  const tieBreaker = selectedPriority.selectedIndex === 0
    ? 0 : (MIN_FEE_PER_BYTE * feePerByte * Math.random());

  const size = transactions.getBytes(schema, transactionObject).length;

  const calculatedFee = Number(minFee) + size * feePerByte + tieBreaker;
  const cappedFee = Math.min(calculatedFee, maxAssetFee);
  const feeInLsk = fromRawLsk(cappedFee.toString());
  const roundedValue = Number(feeInLsk).toFixed(7).toString();

  const feedback = transaction.amount === ''
    ? '-'
    : `${(roundedValue ? '' : 'Invalid amount')}`;

  return {
    value: roundedValue,
    error: !!feedback,
    feedback,
  };
};

const signMultisigUsingPrivateKey = (
  schema, transaction, networkIdentifier, keys, privateKey,
  isMultiSignatureRegistration, publicKey, moduleAssetId, rawTransaction,
) => {
  const keysInBinary = {
    optionalKeys: keys.optionalKeys.map(convertStringToBinary),
    mandatoryKeys: keys.mandatoryKeys.map(convertStringToBinary),
  };

  let signedTransaction = transactions.signMultiSignatureTransactionWithPrivateKey(
    schema,
    transaction,
    networkIdentifier,
    Buffer.from(privateKey, 'hex'),
    keysInBinary,
    isMultiSignatureRegistration,
  );

  const transactionKeys = {
    mandatoryKeys: rawTransaction.mandatoryKeys ?? [],
    optionalKeys: rawTransaction.optionalKeys ?? [],
  };

  const needsDoubleSign = [
    ...transactionKeys.mandatoryKeys,
    ...transactionKeys.optionalKeys,
  ].includes(publicKey);

  if (isMultiSignatureRegistration && needsDoubleSign) {
    const transformedTransaction = transformTransaction(signedTransaction);
    const flattenedTransaction = flattenTransaction(transformedTransaction);
    const tx = createTransactionObject(flattenedTransaction, moduleAssetId);
    const transactionKeysInBinary = {
      mandatoryKeys: transactionKeys.mandatoryKeys.map(convertStringToBinary),
      optionalKeys: transactionKeys.optionalKeys.map(convertStringToBinary),
    };

    signedTransaction = transactions.signMultiSignatureTransactionWithPrivateKey(
      schema,
      tx,
      networkIdentifier,
      Buffer.from(privateKey, 'hex'),
      transactionKeysInBinary,
      isMultiSignatureRegistration,
    );
  }
};

const signUsingPrivateKey = (schema, transaction, networkIdentifier, privateKey) =>
  transactions.signTransactionWithPrivateKey(
    schema,
    transaction,
    networkIdentifier,
    Buffer.from(privateKey, 'hex'),
  );

const signUsingHW = async (schema, transaction, account, networkIdentifier) => {
  const signingBytes = transactions.getSigningBytes(schema, transaction);
  result = await signTransactionByHW(
    account,
    networkIdentifier,
    transaction,
    signingBytes,
  );
  return result;
};

/**
 * creates a new transaction
 *
 * @param {Object} transaction The transaction information
 * @param {String} transaction.moduleAssetId The combination of module Id and asset Id.
 * @param {Object} transaction.network Network config from the redux store
 * @param {Object} transaction.keys keys of the multisig account
 * @param {Object} transaction.transactionObject Details of the transaction, including passphrase
 * @param {boolean} transaction.isHwSigning true if an hardware wallet will sign the transaction
 * @returns {Promise} promise that resolves to a transaction or
 * rejects with an error
 */
// eslint-disable-next-line max-statements
export const create = async ({
  network,
  account,
  transactionObject,
}) => {
  const {
    summary: { publicKey, isMultisignature, privateKey },
    keys,
    sequence,
  } = account;
  const networkIdentifier = Buffer.from(network.networks.LSK.networkIdentifier, 'hex');

  const { moduleAssetId, ...rawTransaction } = transactionObject;
  rawTransaction.nonce = sequence.nonce;
  rawTransaction.senderPublicKey = publicKey;
  const transaction = createTransactionObject(rawTransaction, moduleAssetId);

  const schema = moduleAssetSchemas[moduleAssetId];

  try {
    const isMultiSignatureRegistration = moduleAssetId
      === MODULE_ASSETS_NAME_ID_MAP.registerMultisignatureGroup;

    if (isMultisignature || isMultiSignatureRegistration) {
      return signMultisigUsingPrivateKey(
        schema, transaction, networkIdentifier, keys, privateKey,
        isMultiSignatureRegistration, publicKey, moduleAssetId, rawTransaction,
      );
    } if (account.loginType !== loginTypes.passphrase.code) {
      return signUsingPrivateKey(schema, transaction, networkIdentifier, privateKey);
    }
    const signedTx = await signUsingHW(schema, transaction, account);
    return signedTx;
  } catch (error) {
    return error;
  }
};

/**
 * broadcasts a transaction over the network
 *
 * @param {object} transaction
 * @param {Object} network
 * @param {string} network.name - the network name, e.g. mainnet, betanet
 * @param {string} network.address - the node address e.g. https://service.lisk.com
 * @returns {Promise} promise that resolves to a transaction or rejects with an error
 */
export const broadcast = async ({ transaction, serviceUrl }) => {
  const moduleAssetId = joinModuleAndAssetIds({
    moduleID: transaction.moduleID,
    assetID: transaction.assetID,
  });
  const schema = moduleAssetSchemas[moduleAssetId];
  const binary = transactions.getBytes(schema, transaction);
  const payload = binary.toString('hex');
  const body = JSON.stringify({ transaction: payload });

  const response = await http({
    method: 'POST',
    baseUrl: serviceUrl,
    path: '/api/v2/transactions',
    body,
  });

  return response;
};

/**
 * Computes transaction id
 * @param {object} transaction
 * @returns {Promise} returns transaction id for a given transaction object
 */
export const computeTransactionId = ({ transaction }) => {
  const moduleAssetId = joinModuleAndAssetIds({
    moduleID: transaction.moduleID,
    assetID: transaction.assetID,
  });
  const schema = moduleAssetSchemas[moduleAssetId];
  const transactionBytes = transactions.getBytes(schema, transaction);
  const id = cryptography.hash(transactionBytes);

  return id;
};
