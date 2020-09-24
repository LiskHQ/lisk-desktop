import Lisk from '@liskhq/lisk-client';
import { getAPIClient } from './network';
import { getTimestampFromFirstBlock } from '../../datetime';
import { toRawLsk, fromRawLsk } from '../../lsk';
import txFilters from '../../../constants/transactionFilters';
import transactionTypes, { minFeePerByte } from '../../../constants/transactionTypes';
import { adaptTransactions, adaptTransaction } from './adapters';

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

const txTypeClassMap = {
  transfer: Lisk.transactions.TransferTransaction,
  registerDelegate: Lisk.transactions.DelegateTransaction,
  vote: Lisk.transactions.VoteTransaction,
};

export const createTransactionInstance = (rawTx, type) => {
  const DUMMY_FEE = '18446744073709551615';
  const DUMMY_SIGNATURE = '204514eb1152355799ece36d17037e5feb4871472c60763bdafe67eb6a38bec632a8e2e62f84a32cf764342a4708a65fbad194e37feec03940f0ff84d3df2a05';

  const asset = {
    data: rawTx.data,
    recipientId: rawTx.recipient,
    amount: rawTx.amount,
  };

  if (type === 'registerDelegate') {
    asset.username = rawTx.username;
  } else if (type === 'vote') {
    asset.votes = rawTx.votes;
  }

  const TxClass = txTypeClassMap[type];
  const tx = new TxClass({
    senderPublicKey: rawTx.senderPublicKey,
    nonce: rawTx.nonce,
    asset,
    fee: DUMMY_FEE,
    signatures: [DUMMY_SIGNATURE],
  });

  return tx;
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
    const fee = 1e3;

    // @todo use real fee estimates
    resolve({
      Low: fee,
      Medium: fee * 2,
      High: fee * 3,
    });
  }));


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
