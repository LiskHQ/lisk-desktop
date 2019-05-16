import Lisk from '@liskhq/lisk-client';
import { toRawLsk } from '../../../utils/lsk';
import { getTimestampFromFirstBlock } from '../../datetime';
import txFilters from '../../../constants/transactionFilters';
import { getAPIClient } from './network';

export const send = (
  liskAPIClient,
  recipientId,
  amount,
  passphrase,
  secondPassphrase = null,
  data,
  timeOffset,
) =>
  new Promise((resolve, reject) => {
    const transaction = Lisk.transaction.transfer({
      recipientId, amount: `${amount}`, passphrase, secondPassphrase, data, timeOffset,
    });
    liskAPIClient.transactions.broadcast(transaction).then(() => {
      resolve(transaction);
    }).catch(reject);
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
  networkConfig, address, limit, offset, type = undefined,
  sort = 'timestamp:desc', filter, customFilters = {},
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
