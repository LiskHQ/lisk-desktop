// import { requestToActivePeer } from './peers';
import Lisk from 'lisk-elements';
import getMappedFunction from './functionMapper';
import { tokenMap } from '../../constants/tokens';

export const getAccount = (liskAPIClient, address) =>
  new Promise((resolve, reject) => {
    if (!liskAPIClient) {
      reject();
    }
    liskAPIClient.accounts.get({ address }).then((res) => {
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

// export const setSecondPassphrase = (liskAPIClient, secondSecret, publicKey, secret) =>
//   requestToActivePeer(liskAPIClient, 'signatures', { secondSecret, publicKey, secret });

export const setSecondPassphrase = (
  liskAPIClient,
  secondPassphrase,
  publicKey,
  passphrase,
  timeOffset,
) =>
  new Promise((resolve, reject) => {
    const transaction = Lisk.transaction
      .registerSecondPassphrase({ passphrase, secondPassphrase, timeOffset });
    liskAPIClient.transactions.broadcast(transaction).then(() => {
      resolve(transaction);
    }).catch(reject);
  });

// Temporary btc account utility while we don't normalize the apis calls.
export const btc = {
  getAccount: (address, netCode) => getMappedFunction(tokenMap.BTC.key, 'account', 'getSummary')(address, netCode),
  extractAddress: (passphrase, netCode) => getMappedFunction(tokenMap.BTC.key, 'account', 'extractAddress')(passphrase, netCode),
};
