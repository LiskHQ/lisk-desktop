import liskClient from 'Utils/lisk-client'; // eslint-disable-line
import { tokenMap } from '../constants/tokens';
import { balanceNeededForInitialization } from '../constants/account';

export const extractPublicKey = (passphrase, apiVersion) => {
  const Lisk = liskClient(apiVersion);
  return Lisk.cryptography.getKeys(passphrase).publicKey;
};

/**
 * @param {String} data - passphrase or public key
 */
export const extractAddress = (data, apiVersion) => {
  const Lisk = liskClient(apiVersion);
  if (!data) {
    return false;
  }
  if (data.indexOf(' ') < 0) {
    return Lisk.cryptography.getAddressFromPublicKey(data);
  }
  return Lisk.cryptography.getAddressFromPassphrase(data);
};

export const getActiveTokenAccount = state => ({
  ...state.account,
  ...((state.account.info && state.account.info[
    state.settings.token && state.settings.token.active
      ? state.settings.token.active
      : tokenMap.LSK.key
  ]) || {}),
});

export const isAccountInitialized = account => account
  && account.info
  && account.info.LSK
  && !!account.info.LSK.serverPublicKey;

export const hasEnoughBalanceForInitialization = (balance = 0) =>
  Number(balance) >= balanceNeededForInitialization;
