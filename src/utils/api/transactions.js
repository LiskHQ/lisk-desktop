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
  activePeer, address, limit = 20, offset = 0, orderBy = 'timestamp:desc', filter = txFilters.all,
}) => {
  let params = {
    recipientId: (filter === txFilters.incoming || filter === txFilters.all) ? address : undefined,
    senderId: (filter === txFilters.outgoing || filter === txFilters.all) ? address : undefined,
    limit,
    offset,
    orderBy,
  };
  params = JSON.parse(JSON.stringify(params));
  return requestToActivePeer(activePeer, 'transactions', params);
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

