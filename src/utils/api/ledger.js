import to from 'await-to-js';
import {
  createSendTX,
  createDelegateTX,
  createSecondPassphraseTX,
  createRawVoteTX,
} from '../rawTransactionWrapper';
import {
  calculateSecondPassphraseIndex,
  signTransactionWithLedger,
  getAccountFromLedgerIndex,
} from '../ledger';
import { getAccount } from './account';

/**
 * Trigger this action to sign and broadcast a SendTX with Ledger Account
 * NOTE: secondPassphrase for ledger is a PIN (numeric)
 * @returns Promise - Action Send with Ledger
 */
/* eslint-disable prefer-const */
export const sendWithLedger = (
  liskAPIClient, account, recipientId, amount, pin = null, data = null,
) => new Promise(async (resolve, reject) => {
  const rawTx = createSendTX(account.publicKey, recipientId, amount, data);
  let error;
  let signedTx;
  [error, signedTx] = await to(signTransactionWithLedger(rawTx, account, pin));
  if (error) {
    reject(error);
  } else {
    liskAPIClient.transactions.broadcast(signedTx).then(() => {
      resolve(signedTx);
    }).catch(reject);
  }
});

/**
 * Trigger this action to sign and broadcast a RegisterDelegateTX with Ledger Account
 * NOTE: secondPassphrase for ledger is a PIN (numeric)
 * @returns Promise - Action RegisterDelegate with Ledger
 */
export const registerDelegateWithLedger = (
  liskAPIClient, account, username, pin = null,
) => new Promise(async (resolve, reject) => {
  const rawTx = createDelegateTX(account.publicKey, username);
  let error;
  let signedTx;
  [error, signedTx] = await to(signTransactionWithLedger(rawTx, account, pin));
  if (error) {
    reject(error);
  } else {
    liskAPIClient.transactions.broadcast(signedTx).then(() => {
      resolve(signedTx);
    }).catch(reject);
  }
});
/**
 * Trigger this action to sign and broadcast a VoteTX with Ledger Account
 * NOTE: secondPassphrase for ledger is a PIN (numeric)
 * @returns Promise - Action Vote with Ledger
 */
export const voteWithLedger = (
  liskAPIClient, account, votedList, unvotedList, pin = null,
) => new Promise(async (resolve, reject) => {
  const rawTx = createRawVoteTX(account.publicKey, account.address, votedList, unvotedList);
  let error;
  let signedTx;
  [error, signedTx] = await to(signTransactionWithLedger(rawTx, account, pin));
  if (error) {
    reject(error);
  } else {
    liskAPIClient.transactions.broadcast(signedTx).then(() => {
      resolve(signedTx);
    }).catch(reject);
  }
});
/**
 * Trigger this action to sign and broadcast a SetSecondPassphraseTX with Ledger Account
 * NOTE: secondPassphrase for ledger is a PIN (numeric)
 * @returns Promise - Action SetSecondPassphrase with Ledger
 */
export const setSecondPassphraseWithLedger = (
  liskAPIClient, account, pin,
) => new Promise(async (resolve, reject) => { // eslint-disable-line max-statements
  let error;
  let signedTx;
  let secondAccount;
    [error, secondAccount] =      await to(getAccountFromLedgerIndex(calculateSecondPassphraseIndex(account.hwInfo.derivationIndex, pin))); // eslint-disable-line
  if (error) {
    reject(error);
    return;
  }
  const rawTx = createSecondPassphraseTX(account.publicKey, secondAccount.publicKey);
  // No PIN as second Signature
  [error, signedTx] = await to(signTransactionWithLedger(rawTx, account));
  if (error) {
    reject(error);
  } else {
    liskAPIClient.transactions.broadcast(signedTx).then(() => {
      resolve(signedTx);
    }).catch(reject);
  }
});
export const getLedgerAccountInfo = async (liskAPIClient, accountIndex) => {
  let error;
  let liskAccount;
  [error, liskAccount] = await to(getAccountFromLedgerIndex(accountIndex));
  if (error) {
    throw error;
  }
  let resAccount = await getAccount(liskAPIClient, liskAccount.address);
  const isInitialized = !!resAccount.unconfirmedBalance;
  Object.assign(resAccount, { isInitialized });
  // Set PublicKey from Ledger Info
  // so we can switch on this account even if publicKey is not revealed to the network
  Object.assign(resAccount, { publicKey: liskAccount.publicKey });
  //  if (isInitialized) {
  //   const txAccount = await getTransactions(liskAPIClient, liskAccount.address);
  //   Object.assign(resAccount, { txCount: txAccount.meta.count });
  //    const votesAccount = await getVotes(liskAPIClient, liskAccount.address);
  //   Object.assign(resAccount, { votesCount: votesAccount.data.votesUsed });
  // }
  return resAccount;
};
