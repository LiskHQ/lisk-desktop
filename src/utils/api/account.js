import { requestToActivePeer } from './peers';
import txFilters from './../../constants/transactionFilters';

export const getAccount = (activePeer, address) =>
  new Promise((resolve, reject) => {
    activePeer.getAccount(address, (data) => {
      if (data.success) {
        resolve({
          ...data.account,
          serverPublicKey: data.account.publicKey,
        });
      } else if (!data.success && data.error === 'Account not found') {
        // when the account has no transactions yet (therefore is not saved on the blockchain)
        // this endpoint returns { success: false }
        resolve({
          address,
          balance: 0,
        });
      } else {
        reject(data);
      }
    });
  });

export const setSecondPassphrase = (activePeer, secondSecret, publicKey, secret) =>
  requestToActivePeer(activePeer, 'signatures', { secondSecret, publicKey, secret });

export const send = (activePeer, recipientId, amount, secret, secondSecret = null) =>
  requestToActivePeer(
    activePeer, 'transactions',
    {
      recipientId, amount, secret, secondSecret,
    },
  );

export const transactions = ({
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

export const transaction = ({ activePeer, id }) => requestToActivePeer(activePeer, 'transactions/get', { id });

export const unconfirmedTransactions = (activePeer, address, limit = 20, offset = 0, orderBy = 'timestamp:desc') =>
  requestToActivePeer(activePeer, 'transactions/unconfirmed', {
    senderId: address,
    recipientId: address,
    limit,
    offset,
    orderBy,
  });

