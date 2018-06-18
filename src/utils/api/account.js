import { requestToActivePeer } from './peers';

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

