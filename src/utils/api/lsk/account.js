
import Lisk from '@liskhq/lisk-client'; // eslint-disable-line
import api from '..';
import { tokenMap } from '../../../constants/tokens';
import { getAPIClient } from './network';
import { extractAddress, extractPublicKey } from '../../account';

export const getAccount = params =>
  new Promise((resolve, reject) => {
    const apiClient = getAPIClient(params.network);

    const publicKey = params.publicKey || extractPublicKey(params.passphrase);
    const address = params.address || extractAddress(params.passphrase || publicKey);

    if (!apiClient || (!address && !params.username)) {
      reject(Error('Malformed parameters.'));
      return;
    }

    const query = address ? { address } : { username: params.username };

    apiClient.accounts.get(query).then((res) => {
      const offlineInfo = {
        address,
        publicKey,
        token: tokenMap.LSK.key,
      };
      const onlineInfo = res.data.length > 0
        ? { serverPublicKey: res.data[0].publicKey, ...res.data[0] }
        : { balance: 0 };

      resolve({ ...onlineInfo, ...offlineInfo });
    }).catch(reject);
  });

export const setSecondPassphrase = (
  liskAPIClient,
  secondPassphrase,
  publicKey,
  passphrase,
  timeOffset,
  networkIdentifier,
) =>
  new Promise((resolve, reject) => {
    const { transaction } = Lisk
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
