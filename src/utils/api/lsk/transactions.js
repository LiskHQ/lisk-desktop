import Lisk from '@liskhq/lisk-client';
import { getAPIClient } from './network';
import { getTimestampFromFirstBlock } from '../../datetime';
import { toRawLsk } from '../../lsk';
import txFilters from '../../../constants/transactionFilters';
// eslint-disable-next-line import/no-named-default
import { default as getTransactionTypes } from '../../../constants/transactionTypes';
import { adaptTransactions, adaptTransaction } from './adapters';
import { findTransactionSizeInBytes } from '../../transactions';

const minFeePerByte = 10e-5;

const transactionTypes = getTransactionTypes();

/**
 * a record of transaction types and their name fees
 */
const transactionsNameFeeMap = {
  [transactionTypes.send.key]: 0,
  [transactionTypes.vote.key]: 0,
  [transactionTypes.createMultiSig.key]: 0,
  [transactionTypes.registerDelegate.key]: 10,
};


const parseTxFilters = (filter = txFilters.all, address) => ({
  [txFilters.incoming]: { recipientId: address, type: transactionTypes.send.outgoingCode },
  [txFilters.outgoing]: { senderId: address, type: transactionTypes.send.outgoingCode },
  [txFilters.all]: { senderIdOrRecipientId: address },
}[filter]);

const processParam = (filters, filtersKey, paramsKey, transformFn) => ({
  ...(filters[filtersKey] && filters[filtersKey] !== '' ? {
    [paramsKey]: transformFn(filters[filtersKey]),
  } : {}),
});

const parseCustomFilters = filters => ({
  ...processParam(filters, 'message', 'data', value => `%${value}%`),
  ...processParam(filters, 'dateFrom', 'fromTimestamp', (value) => {
    const fromTimestamp = getTimestampFromFirstBlock(value, 'DD.MM.YY');
    return fromTimestamp > 0 ? fromTimestamp : 0;
  }),
  ...processParam(filters, 'dateTo', 'toTimestamp', (value) => {
    const toTimestamp = getTimestampFromFirstBlock(value, 'DD.MM.YY', { inclusive: true });
    return toTimestamp > 1 ? toTimestamp : 1;
  }),
  ...processParam(filters, 'amountFrom', 'minAmount', toRawLsk),
  ...processParam(filters, 'amountTo', 'maxAmount', toRawLsk),
});

export const getTransactions = ({
  networkConfig, liskAPIClient, address, limit,
  offset, type = undefined, filters = {},
}) => {
  const params = {
    limit,
    offset,
    // sort, @todo Fix the sort
    ...parseTxFilters(filters.direction, address),
    ...parseCustomFilters(filters),
    ...(type !== undefined ? { type } : {}),
  };

  return new Promise((resolve, reject) => {
    (liskAPIClient || getAPIClient(networkConfig)).transactions.get(params).then(response => (
      resolve(adaptTransactions(response))
    )).catch(reject);
  });
};

export const getSingleTransaction = ({
  id, network,
}) => new Promise((resolve, reject) => {
  const apiClient = getAPIClient(network);
  apiClient.transactions.get({ id })
    .then((response) => {
      if (response.data.length !== 0) {
        resolve(adaptTransaction(response));
      } else {
        apiClient.node.getTransactions('ready', { id }).then((unconfirmedRes) => {
          if (unconfirmedRes.data.length !== 0) {
            resolve(adaptTransaction(unconfirmedRes));
          } else {
            reject(new Error(`Transaction with id "${id}" not found`));
          }
        }).catch(reject);
      }
    }).catch(reject);
});

/**
 * gets the name fee for a transaction type
 * @param {number} transactionType the transaction type
 * @returns {number} transaction name fee
 */
const getNameFee = transactionType => transactionsNameFeeMap[transactionType];

/**
 * Calculates the min. transaction fee needed for a transaction
 * @param {object} transaction transaction object
 * @param {number} type transaction type
 * @returns {number} min transaction fee
 */
export const calculateTransactionFee = (
  transaction, type,
) => {
  const fees = findTransactionSizeInBytes({
    transaction, type,
  }) * minFeePerByte + getNameFee(type);

  return parseFloat(fees.toFixed(8));
};

/**
 * Calculates the transaction priority fee options
 * @param {object} transaction transaction object
 * @param {number} type transaction type
 * @returns {{low: number, medium: number, high: number}} with low,
 * medium and high priority fee options
 */
export const getTransactionFeeEstimates = (
  transaction, type,
) => {
  const fee = calculateTransactionFee(transaction, type);

  // @todo use real fee estimates
  return {
    low: fee,
    medium: fee * 2,
    high: fee * 3,
  };
};

/**
 * creates a new transaction
 * @param {Object} transaction
 * @param {string} transactionType
 * @returns {Promise} promise that resolves to a transaction or rejects with an error
 */
export const create = (
  transaction, transactionType,
) => new Promise((resolve, reject) => {
  try {
    const { networkIdentifier } = transaction.network.networks.LSK;
    const tx = Lisk.transaction[transactionType]({
      ...transaction,
      networkIdentifier,
    });
    resolve(tx);
  } catch (error) {
    reject(error);
  }
});

/**
 * broadcasts a transaction over the network
 * @param {object} transaction
 * @param {object} networkConfig
 * @returns {Promise} promise that resolves to a transaction or rejects with an error
 */
export const broadcast = (transaction, networkConfig) => new Promise(
  async (resolve, reject) => {
    try {
      await getAPIClient(networkConfig).transactions.broadcast(transaction);
      resolve(transaction);
    } catch (error) {
      reject(error);
    }
  },
);
