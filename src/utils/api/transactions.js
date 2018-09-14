import Lisk from 'lisk-elements';
import txFilters from './../../constants/transactionFilters';

export const send = (
  activePeer,
  recipientId,
  amount,
  passphrase,
  secondPassphrase = null,
  data,
  timeOffset,
) =>
  new Promise((resolve) => {
    const transaction = Lisk.transaction.transfer({
      recipientId, amount, passphrase, secondPassphrase, data, timeOffset,
    });
    activePeer.transactions.broadcast(transaction).then(() => {
      resolve(transaction);
    });
  });

export const getTransactions = ({
  activePeer, address, limit = 20, offset = 0,
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
  return activePeer.transactions.get(params);
};

export const getSingleTransaction = ({ activePeer, id }) => new Promise((resolve, reject) => {
  if (!activePeer) {
    reject();
  } else {
    activePeer.transactions.get({ id }).then(response => resolve(response));
  }
});

export const unconfirmedTransactions = (activePeer, address, limit = 20, offset = 0, sort = 'timestamp:desc') =>
  activePeer.node.getTransactions('unconfirmed', {
    senderId: address,
    limit,
    offset,
    sort,
  });
