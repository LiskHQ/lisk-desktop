import { passphrase, cryptography } from '@liskhq/lisk-client'; // eslint-disable-line

import { tokenMap } from '../constants/tokens';
import regex from './regex';

/**
 * Extracts Lisk PublicKey from a given valid Mnemonic passphrase
 *
 * @param {String} passphrase - Valid Mnemonic passphrase
 * @returns {String|Boolean} - Extracted publicKey for a given valid passphrase or
 * false for a given invalid passphrase
 */
export const extractPublicKey = (passphrase) => {
  if (Lisk.passphrase.Mnemonic.validateMnemonic(passphrase)) {
    return Lisk.cryptography.getKeys(passphrase).publicKey;
  }
  return false;
};

/**
 * Extracts Lisk address from given passphrase or publicKey
 *
 * @param {String} data - passphrase or public key
 * @returns {String|Boolean} - Extracted address for a given valid passphrase or
 * publicKey and false for a given invalid passphrase
 */
export const extractAddress = (data) => {
  if (passphrase.Mnemonic.validateMnemonic(data)) {
    return cryptography.getAddressFromPassphrase(data);
  }
  if (regex.publicKey.test(data)) {
    return cryptography.getAddressFromPublicKey(data);
  }
  return false;
};

export const getActiveTokenAccount = state => ({
  ...state.account,
  ...((state.account.info && state.account.info[
    state.settings.token && state.settings.token.active
      ? state.settings.token.active
      : tokenMap.LSK.key
  ]) || {}),
});

/**
 * Returns a shorter version of a given address
 * by replacing characters by ellipsis except for
 * the first and last 3.
 * @param {String} address LSk or BTC address
 * @returns {String} Truncated address
 */
export const truncateAddress = address =>
  address.replace(regex.lskAddressTrunk, '$1...$3');

/**
 * calculates the balance locked in votes
 */
export const calculateBalanceLockedInVotes = (votes = {}) =>
  Object.values(votes).reduce((total, vote) => (total + vote.confirmed), 0);

/**
 * calculates balance locked for the account in unvotes
*/
export const calculateBalanceLockedInUnvotes = (unlocking = []) =>
  unlocking.reduce((acc, vote) => acc + parseInt(vote.amount, 10), 0);

export const isBlockHeightReached = (unlockHeight, currentBlockHeight) =>
  currentBlockHeight >= unlockHeight;

/**
 * returns unlocking objects for broadcasting an unlock transaction
 * at the current height
 */
export const getUnlockableUnlockingObjects = (unlocking = [], currentBlockHeight = 0) =>
  unlocking.filter(vote => isBlockHeightReached(vote.height.end, currentBlockHeight))
    .map(vote => ({
      delegateAddress: vote.delegateAddress,
      amount: vote.amount,
      unvoteHeight: Number(vote.height.start),
    }));

/**
 * returns the balance that can be unlocked at the current block height
 */
export const calculateUnlockableBalance = (unlocking = [], currentBlockHeight = 0) =>
  unlocking.reduce(
    (sum, vote) =>
      (isBlockHeightReached(vote.height.end, currentBlockHeight)
        ? sum + parseInt(vote.amount, 10) : sum),
    0,
  );

/**
 * returns the balance that can not be unlocked at the current block height
 */
export const calculateBalanceUnlockableInTheFuture = (unlocking = [], currentBlockHeight = 0) =>
  unlocking.reduce(
    (sum, vote) =>
      (!isBlockHeightReached(vote.height.end, currentBlockHeight)
        ? sum + parseInt(vote.amount, 10) : sum),
    0,
  );
