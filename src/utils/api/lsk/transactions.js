import Lisk from '@liskhq/lisk-client';
import { getAPIClient } from './network';
import { getTimestampFromFirstBlock } from '../../datetime';
import { toRawLsk, fromRawLsk } from '../../lsk';
import txFilters from '../../../constants/transactionFilters';
// eslint-disable-next-line import/no-named-default
import transactionTypes, { minFeePerByte } from '../../../constants/transactionTypes';
import { adaptTransactions, adaptTransaction } from './adapters';
import { findTransactionSizeInBytes } from '../../transactions';

const parseTxFilters = (filter = txFilters.all, address) => ({
  [txFilters.incoming]: { recipientId: address, type: transactionTypes().transfer.outgoingCode },
  [txFilters.outgoing]: { senderId: address, type: transactionTypes().transfer.outgoingCode },
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
  network, liskAPIClient, address, limit,
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
    (liskAPIClient || getAPIClient(network)).transactions.get(params).then(response => (
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
 * Calculates the min. transaction fee needed for a transaction
 *
 * @param {object} transaction transaction object
 * @param {number} type transaction type
 * @returns {number} min transaction fee in Beddows
 */
export const calculateMinTxFee = (
  transaction, type,
) => {
  const fees = findTransactionSizeInBytes({
    transaction, type,
  }) * minFeePerByte + transactionTypes.getNameFee(type);

  return fees;
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
      fee: transaction.fee.toString(),
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
 * @param {object} network
 * @returns {Promise} promise that resolves to a transaction or rejects with an error
 */
export const broadcast = (transaction, network) => new Promise(
  async (resolve, reject) => {
    try {
      await getAPIClient(network).transactions.broadcast(transaction);
      resolve(transaction);
    } catch (error) {
      reject(error);
    }
  },
);

/**
 * Returns a dictionary of base fees for low, medium and high processing speeds
 *
 * @todo get from Lisk Ser
 * @returns {Promise<{Low: number, Medium: number, High: number}>} with low,
 * medium and high priority fee options
 */
export const getTransactionBaseFees = () => (
  new Promise(async (resolve) => {
    const fee = 1e7;

    // @todo use real fee estimates
    resolve({
      Low: fee,
      Medium: fee * 2,
      High: fee * 3,
    });
  }));

/**
 * Returns the actual tx fee based on given tx details and selected processing speed
 * @param {String} txData - The transaction object
 * @param {Object} selectedPriority - network configuration
 */
// eslint-disable-next-line max-statements
export const getTransactionFee = async ({
  txData, selectedPriority,
}) => {
  const { txType, ...data } = txData;
  const minFee = calculateMinTxFee(data, txType);
  const feePerByte = Number(fromRawLsk(selectedPriority.value));
  const hardCap = transactionTypes.getHardCap(txType);

  // Tie breaker is only meant for Medium and high processing speeds
  const tieBreaker = selectedPriority.selectedIndex === 0
    ? 0 : minFeePerByte * feePerByte * Math.random();

  let value = minFee + feePerByte * findTransactionSizeInBytes({
    transaction: data, type: txType,
  }) + tieBreaker;
  if (value > hardCap) {
    value = hardCap;
  }

  const roundedValue = parseFloat(Number(fromRawLsk(value)).toFixed(8));
  const feedback = data.amount === ''
    ? '-'
    : `${(value ? '' : 'Invalid amount')}`;

  return {
    value: roundedValue,
    error: !!feedback,
    feedback,
  };
};
