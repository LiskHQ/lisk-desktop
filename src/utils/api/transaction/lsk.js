/* eslint-disable max-lines */
import  { transactions } from '@liskhq/lisk-client';

import http from '../http';
import ws from '../ws';
import transactionTypes from '../../../constants/transactionTypes';
import { getDelegates } from '../delegate';
import regex from '../../regex';
import { tokenMap } from '../../../constants/tokens';
import { fromRawLsk } from '../../lsk';
import { validateAddress } from '../../validators';
import { getApiClient } from '../apiClient';
import schema from '../../../constants/schemas/transfer';

const httpPrefix = '/api/v1';

const httpPaths = {
  feeEstimates: `${httpPrefix}/fee_estimates`,
  transactions: `${httpPrefix}/transactions`,
  transaction: `${httpPrefix}/transactions`,
  transactionStats: `${httpPrefix}/transactions/statistics`,
};

const wsMethods = {
  transactions: 'get.transactions',
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
}).then((response) => {
  const data = response.data.map((tx) => {
    tx.title = transactionTypes.getByCode(tx.type).key;
    return tx;
  });

  return { data, meta: response.meta };
});

const filters = {
  address: { key: 'address', test: address => !validateAddress(tokenMap.LSK.key, address) },
  dateFrom: { key: 'from', test: timestamp => (new Date(timestamp)).getTime() > 0 },
  dateTo: { key: 'to', test: timestamp => (new Date(timestamp)).getTime() > 0 },
  amountFrom: { key: 'min', test: num => parseFloat(num) >= 0 },
  amountTo: { key: 'max', test: num => parseFloat(num) > 0 },
  limit: { key: 'limit', test: num => parseInt(num, 10) > 0 },
  offset: { key: 'offset', test: num => parseInt(num, 10) >= 0 },
  type: { key: 'type', test: num => parseInt(num, 10) > 0 },
  height: { key: 'height', test: num => parseInt(num, 10) > 0 },
  sort: {
    key: 'sort',
    test: str => ['amount:asc', 'amount:desc', 'fee:asc', 'fee:desc', 'type:asc', 'type:desc', 'timestamp:asc', 'timestamp:desc'].includes(str),
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
 * @param {String} data.params.address Sender or recipient account
 * @param {String} data.params.dateFrom Unix timestamp, the start time of txs
 * @param {String} data.params.dateTo Unix timestamp, the end time of txs
 * @param {String} data.params.amountFrom The minimum value of txs
 * @param {String} data.params.amountTo The maximum value of txs
 * @param {Number} data.params.type The title of the transaction type
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
  const typeConfig = params.type && transactionTypes()[params.type];
  // if type, correct the type and use WS
  if (typeConfig) {
    const requests = Object.values(typeConfig.code).map(type => ({
      method: wsMethods.transactions,
      params: { type },
    }));
    // BaseUrl is only used for retrieving archived txs, so it's not needed here.
    return ws({ baseUrl: network.serviceUrl, requests })
      .then((response) => {
        const data = response.data.map((tx) => {
          tx.title = transactionTypes.getByCode(tx.type).key;
          return tx;
        });

        return { data, meta: response.meta };
      });
  }

  const normParams = {};

  // if blockId, ignore others
  if (params.blockId) {
    normParams.block = params.blockId;
  } else {
    // Validate params and fix keys
    Object.keys(params).forEach((key) => {
      if (filters[key] && filters[key].test(params[key])) {
        normParams[filters[key].key] = params[key];
      } else {
        // eslint-disable-next-line no-console
        console.log(`getTransactions: Dropped ${key} parameter, it's invalid.`, params[key]);
      }
    });
  }

  return http({
    network,
    path: httpPaths.transactions,
    params: normParams,
    baseUrl,
  })
    .then((response) => {
      const data = response.data.map((tx) => {
        tx.title = transactionTypes.getByCode(tx.type).key;
        return tx;
      });

      return { data, meta: response.meta };
    });
};

// @todo document this function signature
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
 * Gets the amount of a given transaction
 *
 * @param {Object} transaction The transaction object
 * @returns {String} Amount in beddows/satoshi
 */
export const getTxAmount = (transaction) => {
  let amount = transaction.amount ?? transaction.asset.amount;
  if (transaction.title === 'unlockToken') {
    amount = 0;
    transaction.asset.unlockingObjects.forEach((unlockedObject) => {
      amount += parseInt(unlockedObject.amount, 10);
    });
    amount = `${amount}`;
  }
  if (transaction.title === 'vote') {
    amount = 0;
    transaction.asset.votes.forEach((vote) => {
      amount += parseInt(vote.amount, 10);
    });
    amount = `${amount}`;
  }

  return amount;
};

/**
 * creates a new transaction
 *
 * @param {Object} transaction The transaction information
 * @param {String} transactionType The transaction type title
 * @returns {Promise} promise that resolves to a transaction or
 * rejects with an error
 */
export const create = ({
  network,
  transactionType,
  ...rest
}) => new Promise((resolve, reject) => {
  try {
    const { networkIdentifier } = network.networks.LSK;
    const tx = Lisk.transaction[transactionType]({
      ...rest,
      fee: rest.fee.toString(),
      networkIdentifier,
    });
    resolve(tx);
  } catch (error) {
    reject(error);
  }
});

/**
 * broadcasts a transaction over the network
 *
 * @param {object} transaction
 * @param {Object} network
 * @param {string} network.name - the network name, e.g. mainnet, betanet
 * @param {string} network.address - the node address e.g. https://betanet-lisk.io
 * @returns {Promise} promise that resolves to a transaction or rejects with an error
 */
export const broadcast = ({ transaction, network }) => new Promise(
  async (resolve, reject) => {
    try {
      const client = getApiClient(network);
      const response = await client.transactions.broadcast(transaction);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  },
);

/**
 * Returns a dictionary of base fees for low, medium and high processing speeds
 *
 * @todo The current implementation mocks the results with realistic values.
 * We will refactor this function to fetch the base fees from Lisk Service
 * when the endpoint is ready. Refer to #3081
 *
 * @returns {Promise<{Low: number, Medium: number, High: number}>} with low,
 * medium and high priority fee options
 */
export const getTransactionBaseFees = network =>
  http({
    path: httpPaths.feeEstimates,
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


export const minFeePerByte = 1000;

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
  txData, selectedPriority,
}) => {
  const { moduleID, ...data } = txData;
  // 1. get schema from service and cache it
  // in desktop and create transaction ourselves
  // store schemas locally for now 
  
  // probably not the best idea 
  // 2. expose the ws port of core from service and use apiclient like below

  // const client = await Lisk.apiClient.createClient();
  // client.transaction.create()

  // get the min fee from tx instance client.transaction.minFee(tx)

  // and then sign the transaction using a method outside of apiclient
  // const asset = client.schemas.transactionsAssets.find(asset => asset.moduleID === moduleID);
  // const minFee = transactions.computeMinFee(asset.schema, data);

  const minFee = transactions.computeMinFee(schema, data);
  const feePerByte = selectedPriority.value;
  const hardCap = transactionTypes.getHardCap(txType);

  // Tie breaker is only meant for Medium and high processing speeds
  const tieBreaker = selectedPriority.selectedIndex === 0
    ? 0 : minFeePerByte * feePerByte * Math.random();

  const size = tx.getBytes().length;
  let value = minFee + feePerByte * size + tieBreaker;

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

export const getTokenFromAddress = address => (
  regex.address.test(address) ? tokenMap.LSK.key : tokenMap.BTC.key
);
