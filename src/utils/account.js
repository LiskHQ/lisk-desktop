import { passphrase as LiskPassphrase, cryptography } from '@liskhq/lisk-client';

import { tokenMap } from '@constants';
import regex from './regex';

/**
 * Extracts Lisk PublicKey from a given valid Mnemonic passphrase
 *
 * @param {String} passphrase - Valid Mnemonic passphrase
 * @returns {String?} - Extracted publicKey for a given valid passphrase
 */
export const extractPublicKey = (passphrase) => {
  if (LiskPassphrase.Mnemonic.validateMnemonic(passphrase)) {
    return cryptography.getKeys(passphrase).publicKey.toString('hex');
  }
  throw Error('Invalid passphrase');
};

export const extractAddressFromPublicKey = (data) => {
  if (regex.publicKey.test(data)) {
    return cryptography.getBase32AddressFromPublicKey(data).toString('hex');
  }
  if (Buffer.isBuffer(data)) {
    return cryptography.getBase32AddressFromPublicKey(data);
  }
  throw Error(`Unable to convert publicKey ${data} to address`);
};

export const extractAddressFromPassphrase = (data) => {
  if (LiskPassphrase.Mnemonic.validateMnemonic(data)) {
    return cryptography.getBase32AddressFromPassphrase(data).toString('hex');
  }
  throw Error('Invalid passphrase');
};

/**
 * Extracts Lisk address from given passphrase or publicKey
 *
 * @param {String} data - passphrase or public key
 * @returns {String?} - Extracted address for a given valid passphrase or publicKey
 */
export const extractAddress = (data) => {
  if (cryptography.validateBase32Address()(data)) {
    return cryptography.getAddressFromBase32Address(data);
  }
  if (Buffer.isBuffer(data)) {
    return cryptography.getBase32AddressFromAddress(data);
  }
  throw Error('Invalid publicKey or passphrase');
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
