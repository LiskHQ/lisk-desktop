// import { requestToActivePeer } from './peers';
import Lisk from 'lisk-elements';

export const getAccount = (activePeer, address) =>
  new Promise((resolve, reject) => {
    if (!activePeer) {
      reject();
    }
    activePeer.accounts.get({ address }).then((res) => {
      if (res.data.length > 0) {
        resolve({
          ...res.data[0],
          serverPublicKey: res.data[0].publicKey,
        });
      } else {
        // when the account has no transactions yet (therefore is not saved on the blockchain)
        // this endpoint returns { success: false }
        resolve({
          address,
          balance: 0,
        });
      }
    }).catch(reject);
  });

// export const setSecondPassphrase = (activePeer, secondSecret, publicKey, secret) =>
//   requestToActivePeer(activePeer, 'signatures', { secondSecret, publicKey, secret });

export const setSecondPassphrase = (
  activePeer,
  secondPassphrase,
  publicKey,
  passphrase,
  timeOffset,
) =>
  new Promise((resolve, reject) => {
    const transaction = Lisk.transaction
      .registerSecondPassphrase({ passphrase, secondPassphrase, timeOffset });
    activePeer.transactions.broadcast(transaction).then(() => {
      resolve(transaction);
    }).catch(reject);
  });

