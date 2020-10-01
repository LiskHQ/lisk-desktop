import Lisk from '@liskhq/lisk-client'; // eslint-disable-line

import { tokenMap } from '../constants/tokens';
import { unlockTxDelayAvailability } from '../constants/account';
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
  votes.reduce((acc, vote) => acc + parseInt(vote.amount, 10), 0);

// TODO handle delegate punishment when Lisk Service is ready
export const getDelayedAvailability = isSelfVote => (isSelfVote
  ? unlockTxDelayAvailability.selfUnvote : unlockTxDelayAvailability.unvote);

const isBlockHeightReached = ({ unvoteHeight, delegateAddress }, currentBlock, address) => {
  if (!currentBlock) return false;
  const currentBlockHeight = currentBlock.height;
  const isSelfVote = address === delegateAddress;
  const delayedAvailability = getDelayedAvailability(isSelfVote);
  return currentBlockHeight - unvoteHeight > delayedAvailability;
};

export const getAvailableUnlockingTransactions = ({ unlocking, address }, currentBlock) =>
  unlocking.filter(vote => isBlockHeightReached(vote, currentBlock, address));

export const calculateAvailableBalance = ({ unlocking, address }, currentBlock) =>
  unlocking.reduce((acc, vote) => {
    if (isBlockHeightReached(vote, currentBlock, address)) {
      acc.availableBalance += parseInt(vote.amount, 10);
    }
    return acc;
  }, 0);

/*
export const calculateAvailableAndUnlockingBalance = ({ unlocking, address }, currentBlock) =>
  unlocking.reduce((acc, vote) => {
    if (isBlockHeightReached(vote, currentBlock, address)) {
      acc.availableBalance += parseInt(vote.amount, 10);
    } else {
      acc.unlockingBalance += parseInt(vote.amount, 10);
    }
    return acc;
  }, { availableBalance: 0, unlockingBalance: 0 });
  */
