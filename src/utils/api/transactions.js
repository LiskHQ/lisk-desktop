import Lisk from 'lisk-elements';
import { toRawLsk } from '../../utils/lsk';
import { getTimestampFromFirstBlock } from '../datetime';
import txFilters from './../../constants/transactionFilters';

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

// eslint-disable-next-line max-statements, complexity
export const getTransactions = ({
  liskAPIClient, address, limit = 20, offset = 0,
  sort = 'timestamp:desc', filter = txFilters.all, customFilters = {},
}) => {
  const params = {
    limit,
    offset,
    sort,
  };

  if (customFilters.message) params.data = `%${encodeURIComponent(customFilters.message)}%`;
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
  return liskAPIClient.transactions.get(params);
};

export const getSingleTransaction = ({ liskAPIClient, id }) => new Promise((resolve, reject) => {
  if (!liskAPIClient) {
    reject();
  } else {
    liskAPIClient.transactions.get({ id })
      .then((response) => {
        if (response.data.length !== 0) {
          resolve(response);
        } else {
          resolve(liskAPIClient.node.getTransactions('unconfirmed', { id }).then(resp => resp));
        }
      });
  }
});

export const unconfirmedTransactions = (liskAPIClient, address, limit = 20, offset = 0, sort = 'timestamp:desc') =>
  liskAPIClient.node.getTransactions('unconfirmed', {
    senderId: address,
    limit,
    offset,
    sort,
  });
