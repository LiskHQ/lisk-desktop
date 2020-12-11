import http from '../http';
import ws from '../ws';
import transactionTypes from '../../../constants/transactionTypes';
import { getDelegates } from '../delegate';

/**
 * Retrieves the details of a single transaction
 *
 * @param {Object} data
 * @param {String} data.params - Id of the transaction
 * @param {String?} data.baseUrl - Lisk Service API url to override the
 * existing ServiceUrl on the network param. We may use this to retrieve
 * the details of an archived transaction.
 * @param {Object} data.network - Network setting from Redux store
 * @returns {Promise} Transaction details API call
 */
export const getTransaction = ({
  id, network, baseUrl,
}) => http({
  path: 'transactions',
  params: { id },
  network,
  baseUrl,
});

const txFilters = {
  dateFrom: { key: 'from', test: timestamp => (new Date(timestamp)).getTime() > 0 },
  dateTo: { key: 'to', test: timestamp => (new Date(timestamp)).getTime() > 0 },
  amountFrom: { key: 'min', test: num => typeof num === 'number' && num >= 0 },
  amountTo: { key: 'max', test: num => typeof num === 'number' && num > 0 },
  limit: { key: 'limit', test: num => (typeof num === 'number' && num > 0) },
  offset: { key: 'offset', test: num => (typeof num === 'number' && num >= 0) },
  sort: {
    key: 'sort',
    test: str => ['amount:asc', 'amount:desc', 'timestamp:asc', 'timestamp:desc'].includes(str),
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
 * @param {String} data.params.dateFrom Unix timestamp, the start time of txs
 * @param {String} data.params.dateTo Unix timestamp, the end time of txs
 * @param {String} data.params.amountFrom The minimum value of txs
 * @param {String} data.params.amountTo The maximum value of txs
 * @param {String} data.params.type The title of the transaction type
 * @param {Number} data.params.offset Used for pagination
 * @param {Number} data.params.limit Used for pagination
 * @param {String} data.params.sort an option of 'amount:asc',
 * 'amount:desc', 'timestamp:asc', 'timestamp:desc',
 * @param {Object} data.params.blockId The id of the block whose transaction we want.
 * If passed, all other parameter will be ignored.
 * @returns {Promise} Transactions list API call
 */
export const getTransactions = ({
  network,
  params,
  baseUrl,
}) => {
  const typeConfig = transactionTypes()[params.type];
  // if type, correct the type and use WS
  if (params.type && typeConfig) {
    const requests = Object.values(typeConfig.code).map(type => ({
      method: 'get.transactions',
      params: { type },
    }));
    // BaseUrl is only used for retrieving archived txs, so it's not needed here.
    return ws({ baseUrl: network.serviceUrl, requests });
  }

  const normParams = {};

  // if blockId, ignore others
  if (params.blockId) {
    normParams.block = params.blockId;
  } else {
    // Validate params and fix keys
    Object.keys(params).forEach((key) => {
      if (txFilters[key].test(params[key])) {
        normParams[txFilters[key].key] = params[key];
      } else {
        // eslint-disable-next-line no-console
        console.log(`getTransactions: Dropped ${key} parameter, it's invalid.`);
      }
    });
  }

  return http({
    network,
    path: 'transactions',
    params: normParams,
    baseUrl,
  });
};

export const getRegisteredDelegates = async ({ network }) => {
  const delegates = await getDelegates({
    network,
    params: { limit: 1 },
  });
  const transactions = await getTransactions({
    network,
    params: { type: 'registerDelegate', limit: 100 },
  });

  if (delegates.error || transactions.error) {
    return Error('Error fetching data.');
  }

  // get number of registration in each month
  const monthStats = transactions.data
    .map((tx) => {
      const date = new Date(tx.timestamp * 1000);
      return `${date.getFullYear()}-${date.getMonth() + 1}`;
    }).reduce((acc, date) => {
      if (typeof acc[date] !== 'number') acc[date] = 1;
      else acc[date] += 1;
      return acc;
    }, {});


  // start with [total delegates number]
  // subtract total of each month to get prev month's stats
  return Object.values(monthStats).reduce((acc, item) => {
    acc.unshift(acc[0] - item);
    return acc;
  }, [delegates.meta.total]);
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
export const getTransactionStats = data => http({
  path: `transactions/statistics/${data.params.period}`,
  params: { limit: data.params.limit },
  network: data.network,
});

/**
 * Gets the amount of a given transaction
 *
 * @param {Object} transaction The transaction object
 * @returns {String} Amount in beddows/satoshi
 */
export const getTxAmount = (transaction) => {
  let amount = transaction.amount !== undefined ? transaction.amount : transaction.asset.amount;
  if (!amount && transaction.type === transactionTypes().unlockToken.code.legacy) {
    amount = 0;
    transaction.asset.unlockingObjects.forEach((unlockedObject) => {
      amount += parseInt(unlockedObject.amount, 10);
    });
    amount = `${amount}`;
  }
  return amount;
};

