import Lisk from '@liskhq/lisk-client';
import { toRawLsk } from '../../../utils/lsk';
import { getTimestampFromFirstBlock } from '../../datetime';
import txFilters from '../../../constants/transactionFilters';
import { getAPIClient } from './network';

// TODO remove this function as is replaced right now by Create and Broadcast functions
// Issue ticket #2046
export const send = (
  amount,
  data,
  networkConfig,
  passphrase,
  recipientId,
  secondPassphrase = null,
  timeOffset,
) =>
  new Promise((resolve, reject) => {
    const txId = Lisk.transaction.transfer({
      amount,
      data,
      passphrase,
      recipientId,
      secondPassphrase,
      timeOffset,
    });

    getAPIClient(networkConfig).transactions.broadcast(txId)
      .then(resolve(txId))
      .catch(reject);
  });

const parseTxFilters = (filter = txFilters.all, address) => ({
  [txFilters.incoming]: { recipientId: address },
  [txFilters.outgoing]: { senderId: address },
  [txFilters.all]: { senderIdOrRecipientId: address },
}[filter]);

const processParam = (customFilters, filtersKey, paramsKey, transformFn) => ({
  ...(customFilters[filtersKey] && customFilters[filtersKey] !== '' ? {
    [paramsKey]: transformFn(customFilters[filtersKey]),
  } : {}),
});

const parseCustomFilters = customFilters => ({
  ...processParam(customFilters, 'message', 'data', value => `%${value}%`),
  ...processParam(customFilters, 'dateFrom', 'fromTimestamp', (value) => {
    const fromTimestamp = getTimestampFromFirstBlock(value, 'DD.MM.YY');
    return fromTimestamp > 0 ? fromTimestamp : 0;
  }),
  ...processParam(customFilters, 'dateTo', 'toTimestamp', (value) => {
    const toTimestamp = getTimestampFromFirstBlock(value, 'DD.MM.YY', { inclusive: true });
    return toTimestamp > 1 ? toTimestamp : 1;
  }),
  ...processParam(customFilters, 'amountFrom', 'minAmount', toRawLsk),
  ...processParam(customFilters, 'amountTo', 'maxAmount', toRawLsk),
});

export const getTransactions = ({
  address,
  customFilters = {},
  filter = txFilters.all,
  limit,
  networkConfig,
  offset,
  sort = 'timestamp:desc',
  type = undefined,
}) => {
  const params = {
    limit,
    offset,
    sort,
    ...parseTxFilters(filter, address),
    ...parseCustomFilters(customFilters),
    ...(type !== undefined ? { type } : {}),
  };

  return getAPIClient(networkConfig).transactions.get(params);
};

export const getSingleTransaction = ({
  networkConfig, id, liskAPIClient,
}) => new Promise((resolve, reject) => {
  // TODO remove liskAPIClient after all code that uses is is removed
  const apiClient = liskAPIClient || getAPIClient(networkConfig);
  apiClient.transactions.get({ id })
    .then((response) => {
      if (response.data.length !== 0) {
        resolve(response);
      } else {
        apiClient.node.getTransactions('unconfirmed', { id }).then(resolve).catch(reject);
      }
    }).catch(reject);
});


export const unconfirmedTransactions = (liskAPIClient, address, limit = 20, offset = 0, sort = 'timestamp:desc') =>
  liskAPIClient.node.getTransactions('unconfirmed', {
    senderId: address,
    limit,
    offset,
    sort,
  });


export const create = transaction => new Promise((resolve, reject) => {
  try {
    const tx = Lisk.transaction.transfer(transaction);
    resolve(tx);
  } catch (error) {
    reject(error);
  }
});

export const broadcast = (transaction, networkConfig) => new Promise(async (resolve, reject) => {
  try {
    await getAPIClient(networkConfig).transactions.broadcast(transaction);
    resolve(transaction);
  } catch (error) {
    reject(error);
  }
});
