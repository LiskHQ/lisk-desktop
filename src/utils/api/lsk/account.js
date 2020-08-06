
import liskClient from 'Utils/lisk-client'; // eslint-disable-line
import api from '..';
import { tokenMap } from '../../../constants/tokens';
import { getAPIClient } from './network';
import { extractAddress, extractPublicKey } from '../../account';

export const getAccount = ({
  network,
  address,
  passphrase,
  publicKey,
}) =>
  new Promise((resolve, reject) => {
    // TODO remove liskAPIClient after all code that uses is is removed

    const apiClient = getAPIClient(network);
    if (!apiClient) {
      reject();
      return;
    }
    const apiVersion = network.networks.LSK.apiVersion;

    publicKey = publicKey || (passphrase && extractPublicKey(passphrase, apiVersion));
    address = address || extractAddress(passphrase || publicKey);
    apiClient.accounts.get({ address }).then((res) => {
      if (res.data.length > 0) {
        resolve({
          ...res.data[0],
          // It is necessary to disable this rule, because eslint --fix would
          // change it to publicKey || res.data[0].publicKey
          // but that is not equivalent to the ternary if the first value is
          // defined and the second one not.
          // eslint-disable-next-line no-unneeded-ternary
          publicKey: publicKey ? publicKey : res.data[0].publicKey,
          serverPublicKey: res.data[0].publicKey,
          token: tokenMap.LSK.key,
        });
      } else {
        // when the account has no transactions yet (therefore is not saved on the blockchain)
        // this endpoint returns { success: false }
        resolve({
          address,
          publicKey,
          balance: 0,
          token: tokenMap.LSK.key,
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
  networkIdentifier,
  apiVersion,
) =>
  new Promise((resolve, reject) => {
    const transaction = liskClient(apiVersion).transaction
      .registerSecondPassphrase({
        passphrase,
        secondPassphrase,
        timeOffset,
        networkIdentifier,
      });
    liskAPIClient.transactions.broadcast(transaction).then(() => {
      resolve(transaction);
    }).catch(reject);
  });

export const btc = { // Temporary btc account utility while we don't normalize the apis calls.
  extractAddress: /* istanbul ignore next */ (passphrase, netCode) =>
    api.BTC.account.extractAddress(passphrase, netCode),
};
