import liskClient from 'Utils/lisk-client'; // eslint-disable-line
import { getAPIClient } from './network';
import { getTimestampFromFirstBlock } from '../../datetime';
import { toRawLsk } from '../../lsk';
import txFilters from '../../../constants/transactionFilters';
import transactionTypes from '../../../constants/transactionTypes';
import { adaptTransactions, adaptTransaction } from './adapters';

const parseTxFilters = (filter = txFilters.all, address) => ({
  [txFilters.incoming]: { recipientId: address, type: transactionTypes().send.outgoingCode },
  [txFilters.outgoing]: { senderId: address, type: transactionTypes().send.outgoingCode },
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
  network, liskAPIClient, address, limit, offset, type = undefined,
  sort = 'timestamp:desc', filters = {},
}) => {
  const params = {
    limit,
    offset,
    sort,
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

export const create = (
  transaction, transactionType, apiVersion,
) => new Promise((resolve, reject) => {
  try {
    const Lisk = liskClient(apiVersion);
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

export const broadcast = (transaction, network) => new Promise(async (resolve, reject) => {
  try {
    await getAPIClient(network).transactions.broadcast(transaction);
    resolve(transaction);
  } catch (error) {
    reject(error);
  }
});
