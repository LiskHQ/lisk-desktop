import Lisk from 'lisk-elements';
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

export const getTransactions = ({
  liskAPIClient, address, limit = 20, offset = 0,
  sort = 'timestamp:desc', filter = txFilters.all,
}) => {
  const params = {
    limit,
    offset,
    sort,
  };

  if (filter === txFilters.incoming) params.recipientId = address;
  if (filter === txFilters.outgoing) params.senderId = address;
  if (filter === txFilters.all) params.senderIdOrRecipientId = address;
  return liskAPIClient.transactions.get(params);
};

export const getSingleTransaction = ({ liskAPIClient, id }) => new Promise((resolve, reject) => {
  if (!liskAPIClient) {
    reject();
  } else {
    liskAPIClient.transactions.get({ id }).then(response => resolve(response));
  }
});

export const unconfirmedTransactions = (liskAPIClient, address, limit = 20, offset = 0, sort = 'timestamp:desc') =>
  liskAPIClient.node.getTransactions('unconfirmed', {
    senderId: address,
    limit,
    offset,
    sort,
  });
