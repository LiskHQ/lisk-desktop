import Lisk from '@liskhq/lisk-client'; // eslint-disable-line

import { tokenMap } from '../constants/tokens';
import { unlockTxDelayAvailability } from '../constants/account';
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
  if (Lisk.passphrase.Mnemonic.validateMnemonic(data)) {
    return Lisk.cryptography.getAddressFromPassphrase(data);
  }
  if (regex.publicKey.test(data)) {
    return Lisk.cryptography.getAddressFromPublicKey(data);
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

export const calculateTotalLockedBalance = (votes = []) =>
  votes.reduce((acc, vote) => acc + parseInt(vote.amount, 10), 0);

// TODO handle delegate punishment when Lisk Service is ready
export const getDelayedAvailability = isSelfVote => (isSelfVote
  ? unlockTxDelayAvailability.selfUnvote : unlockTxDelayAvailability.unvote);

export const isBlockHeightReached = ({ height, delegateAddress }, currentBlock, address) => {
  if (!currentBlock) return false;
  const currentBlockHeight = currentBlock.height;
  const isSelfVote = address === delegateAddress;
  const delayedAvailability = getDelayedAvailability(isSelfVote);
  return currentBlockHeight - height.end > delayedAvailability;
};

export const getAvailableUnlockingTransactions = ({ unlocking = [], address }, currentBlock) =>
  unlocking.filter(vote => isBlockHeightReached(vote, currentBlock, address))
    .map(vote => ({
      delegateAddress: vote.delegateAddress,
      amount: vote.amount,
      unvoteHeight: Number(vote.height.start),
    }));

export const calculateUnlockableBalance = ({ unlocking = [], address }, currentBlock) =>
  unlocking.reduce(
    (acc, vote) =>
      (isBlockHeightReached(vote, currentBlock, address) ? acc + parseInt(vote.amount, 10) : acc),
    0,
  );

export const calculateLockedBalance = ({ unlocking = [], address }, currentBlock) =>
  unlocking.reduce(
    (acc, vote) =>
      (!isBlockHeightReached(vote, currentBlock, address) ? acc + parseInt(vote.amount, 10) : acc),
    0,
  );
