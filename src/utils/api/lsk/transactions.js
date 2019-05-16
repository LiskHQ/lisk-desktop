import Lisk from 'lisk-elements';
import { toRawLsk } from '../../../utils/lsk';
import { getTimestampFromFirstBlock } from '../../datetime';
import txFilters from '../../../constants/transactionFilters';
import { getAPIClient } from './network';

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

// eslint-disable-next-line max-statements, complexity, import/prefer-default-export
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
  };

  if (type !== undefined) params.type = type;
  if (customFilters.message) params.data = `%${customFilters.message}%`;
  if (customFilters.dateFrom && customFilters.dateFrom !== '') {
    params.fromTimestamp = getTimestampFromFirstBlock(customFilters.dateFrom, 'DD.MM.YY');
    params.fromTimestamp = params.fromTimestamp > 0 ? params.fromTimestamp : 0;
  }
  if (customFilters.dateTo && customFilters.dateTo !== '') {
    params.toTimestamp = getTimestampFromFirstBlock(customFilters.dateTo, 'DD.MM.YY', { inclusive: true });
    params.toTimestamp = params.toTimestamp > 1 ? params.toTimestamp : 1;
  }
  if (customFilters.amountFrom && customFilters.amountFrom !== '') {
    params.minAmount = toRawLsk(customFilters.amountFrom);
  }
  if (customFilters.amountTo && customFilters.amountTo !== '') {
    params.maxAmount = toRawLsk(customFilters.amountTo);
  }
  if (filter === txFilters.incoming) params.recipientId = address;
  if (filter === txFilters.outgoing) params.senderId = address;
  if (filter === txFilters.all) params.senderIdOrRecipientId = address;
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


export const create = ({
  amount, data, passphrase, recipientId, secondPassphrase, timeOffset,
}) => new Promise((resolve, reject) => {
  try {
    const tx = Lisk.transaction.transfer({
      amount,
      data,
      passphrase,
      recipientId,
      secondPassphrase,
      timeOffset,
    });
    resolve(tx);
  } catch (error) {
    reject(error);
  }
});

export const broadcast = (transaction, networkConfig) => new Promise((resolve, reject) => {
  try {
    getAPIClient(networkConfig).transactions.broadcast(transaction).then(resolve(transaction));
  } catch (error) {
    reject(error);
  }
});
