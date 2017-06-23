import { requestActivePeer } from './peers';

export const get = address =>
  new Promise((resolve) => {
    this.peers.active.getAccount(address, (data) => {
      if (data.success) {
        return resolve(data.account);
      }

      // @todo shouldn't I just reject this promise?
      return resolve({
        address,
        balance: 0,
      });
    });
  });

export const setSecondSecret = (activePeer, secondSecret, publicKey, secret) =>
  requestActivePeer(activePeer, 'signatures', { secondSecret, publicKey, secret });

export const send = (activePeer, recipientId, amount, secret, secondSecret = null) =>
  requestActivePeer(activePeer, 'transactions',
    { recipientId, amount, secret, secondSecret });

export const transactions = (activePeer, address, limit = 20, offset = 0, orderBy = 'timestamp:desc') =>
  requestActivePeer(activePeer, 'transactions', {
    senderId: address,
    recipientId: address,
    limit,
    offset,
    orderBy,
  });
