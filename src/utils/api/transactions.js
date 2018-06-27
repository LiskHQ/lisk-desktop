import { requestToActivePeer } from './peers';
import txFilters from './../../constants/transactionFilters';

export const send = (activePeer, recipientId, amount, secret, secondSecret = null) =>
  requestToActivePeer(
    activePeer, 'transactions',
    {
      recipientId, amount, secret, secondSecret,
    },
  );

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

export const getSingleTransaction = ({ activePeer, id }) => requestToActivePeer(activePeer, 'transactions/get', { id });

export const unconfirmedTransactions = (activePeer, address, limit = 20, offset = 0, orderBy = 'timestamp:desc') =>
  requestToActivePeer(activePeer, 'transactions/unconfirmed', {
    senderId: address,
    recipientId: address,
    limit,
    offset,
    orderBy,
  });

