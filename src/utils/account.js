import Lisk from '@liskhq/lisk-client'; // eslint-disable-line

import { tokenMap } from '../constants/tokens';
import regex from './regex';

export const extractPublicKey = passphrase =>
  Lisk.cryptography.getKeys(passphrase).publicKey;

/**
 * @param {String} data - passphrase or public key
 */
export const extractAddress = (data) => {
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

/**
 * Returns a shorter version of a given address
 * by replacing characters by ellipsis except for
 * the first and last 3.
 * @param {String} address LSk or BTC address
 * @returns {String} Truncated address
 */
export const truncateAddress = address =>
  address.replace(regex.lskAddressTrunk, '$1...$3');

export const calculateLockedBalance = ({ votes }) =>
  votes.reduce((acc, vote) => acc + vote.amount, 0);

const isBlockHeightReached = ({ unvoteHeight, delegateAddress }, currentBlock, address) => {
  /* LIP 023
  function hasWaited(U):
    let account be the account sending the transaction
    if U.delegateAddress == account.address  //this is a self-unvote
        delayedAvailability = 260,000
    else
        delayedAvailability = 2000

    let h be the block height at which the transaction is included
    if h - U.unvoteHeight < delayedAvailability
        return false
    else
        return true
  */
  if (!currentBlock) return false;
  const currentBlockHeight = currentBlock.height;
  // const delayedAvailability = address === delegateAddress ? 260000 : 2000;
  const delayedAvailability = address === delegateAddress ? 10 : 5;
  return currentBlockHeight - unvoteHeight > delayedAvailability;
};

export const getAvailableUnlockingTransactions = ({ unlocking, address }, currentBlock) =>
  unlocking.filter(vote => isBlockHeightReached(vote, currentBlock, address));

export const calculateAvailableAndUnlockingBalance = ({ unlocking, address }, currentBlock) =>
  unlocking.reduce((acc, vote) => {
    if (isBlockHeightReached(vote, currentBlock, address)) {
      acc.availableBalance += parseInt(vote.amount, 10);
    } else {
      acc.unlockingBalance += parseInt(vote.amount, 10);
    }
    return acc;
  }, { availableBalance: 0, unlockingBalance: 0 });
