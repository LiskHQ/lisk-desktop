import { requestToActivePeer } from './peers';

export const getAccount = (activePeer, address) =>
  new Promise((resolve) => {
    activePeer.getAccount(address, (data) => {
      if (data.success) {
        resolve(data.account);
      } else {
        // when the account has no transactions yet (therefore is not saved on the blockchain)
        // this endpoint returns { success: false }
        resolve({
          address,
          balance: 0,
        });
      }
    });
  });

export const setSecondSecret = (activePeer, secondSecret, publicKey, secret) =>
  requestToActivePeer(activePeer, 'signatures', { secondSecret, publicKey, secret });

export const send = (activePeer, recipientId, amount, secret, secondSecret = null) =>
  requestToActivePeer(activePeer, 'transactions',
    { recipientId, amount, secret, secondSecret });

export const transactions = (activePeer, address, limit = 20, offset = 0, orderBy = 'timestamp:desc') =>
  requestToActivePeer(activePeer, 'transactions', {
    senderId: address,
    recipientId: address,
    limit,
    offset,
    orderBy,
  });
