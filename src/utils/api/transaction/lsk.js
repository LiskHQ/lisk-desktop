/* eslint-disable max-lines */
import Lisk from '@liskhq/lisk-client';

import http from '../http';
import ws from '../ws';
import transactionTypes, { minFeePerByte } from '../../../constants/transactionTypes';
import { getDelegates } from '../delegate';
import regex from '../../regex';
import { tokenMap } from '../../../constants/tokens';
import { fromRawLsk } from '../../lsk';
import { validateAddress } from '../../validators';
import { getApiClient } from '../apiClient';

const httpPrefix = '/api/v1';

const httpPaths = {
  feeEstimates: `${httpPrefix}/fee_estimates`,
  transactions: `${httpPrefix}/transactions`,
  transaction: `${httpPrefix}/transactions`,
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
  amountFrom: { key: 'min', test: num => typeof num === 'number' && num >= 0 },
  amountTo: { key: 'max', test: num => typeof num === 'number' && num > 0 },
  limit: { key: 'limit', test: num => (typeof num === 'number' && num > 0) },
  offset: { key: 'offset', test: num => (typeof num === 'number' && num >= 0) },
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
        console.log(`getTransactions: Dropped ${key} parameter, it's invalid.`);
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
  }, tokenMap.LSK.key);

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

const txTypeClassMap = {
  transfer: Lisk.transactions.TransferTransaction,
  registerDelegate: Lisk.transactions.DelegateTransaction,
  vote: Lisk.transactions.VoteTransaction,
  unlockToken: Lisk.transaction.UnlockTransaction,
};

// eslint-disable-next-line max-statements
export const createTransactionInstance = (rawTx, type) => {
  const FEE_BYTES_PLACEHOLDER = '18446744073709551615';
  const SIGNATURE_BYTES_PLACEHOLDER = '204514eb1152355799ece36d17037e5feb4871472c60763bdafe67eb6a38bec632a8e2e62f84a32cf764342a4708a65fbad194e37feec03940f0ff84d3df2a05';
  const asset = {
    data: rawTx.data,
  };

  switch (type) {
    case 'transfer':
      asset.recipientId = rawTx.recipient;
      asset.amount = rawTx.amount;
      break;
    case 'registerDelegate':
      asset.username = rawTx.username || 'abcde';
      break;
    case 'vote':
      asset.votes = rawTx.votes;
      break;
    case 'unlockToken':
      asset.unlockingObjects = rawTx.unlockingObjects;
      break;
    default:
      break;
  }

  const TxClass = txTypeClassMap[type];
  const tx = new TxClass({
    senderPublicKey: rawTx.senderPublicKey,
    nonce: rawTx.nonce,
    asset,
    fee: FEE_BYTES_PLACEHOLDER,
    signatures: [SIGNATURE_BYTES_PLACEHOLDER],
  });

  return tx;
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
 * @param {string} network - the network name, e.g. mainnet, betanet
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

export const getMinTxFee = tx => Number(tx.minFee.toString());

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
  const tx = createTransactionInstance(data, txType);
  const minFee = getMinTxFee(tx);
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
