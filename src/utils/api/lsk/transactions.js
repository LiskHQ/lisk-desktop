import Lisk from 'lisk-elements';
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
      recipientId, amount, passphrase, secondPassphrase, data, timeOffset,
    });
    liskAPIClient.transactions.broadcast(transaction).then(() => {
      resolve(transaction);
    }).catch(reject);
  });

const enhanceTxListResponse = response => ({
  ...response,
  data: response.data.map(tx => ({
    ...tx,
    token: 'LSK',
  })),
});

// eslint-disable-next-line max-statements, complexity, import/prefer-default-export
export const getTransactions = ({
  networkConfig, address, limit, offset, type = undefined,
  sort = 'timestamp:desc', filter = txFilters.all, customFilters = {},
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

  return new Promise((resolve, reject) => {
    getAPIClient(networkConfig).transactions.get(params).then(response => (
      resolve(enhanceTxListResponse(response))
    )).catch(reject);
  });
};

export const getSingleTransaction = ({
  networkConfig, id, liskAPIClient,
}) => new Promise((resolve, reject) => {
  // TODO remove liskAPIClient after all code that uses is is removed
  const apiClient = liskAPIClient || getAPIClient(networkConfig);
  apiClient.transactions.get({ id })
    .then((response) => {
      if (response.data.length !== 0) {
        resolve(enhanceTxListResponse(response));
      } else {
        apiClient.node.getTransactions('unconfirmed', { id }).then(unconfirmedRes => (
          resolve(enhanceTxListResponse(unconfirmedRes))
        )).catch(reject);
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
