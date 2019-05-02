import Lisk from 'lisk-elements';
import getMappedFunction from '../functionMapper';
import { tokenMap } from '../../../constants/tokens';
import { getAPIClient } from './network';

export const getAccount = ({ liskAPIClient, networkConfig, address }) =>
  new Promise((resolve, reject) => {
    // TODO remove liskAPIClient after all code that uses is is removed
    const apiClient = liskAPIClient || getAPIClient(networkConfig);
    if (!apiClient) {
      reject();
    }
    apiClient.accounts.get({ address }).then((res) => {
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

export const btc = { // Temporary btc account utility while we don't normalize the apis calls.
  extractAddress: /* istanbul ignore next */ (passphrase, netCode) =>
    getMappedFunction(tokenMap.BTC.key, 'account', 'extractAddress')(passphrase, netCode),
};
