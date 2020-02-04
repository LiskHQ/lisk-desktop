import { castVotes, transfer, utils } from '@liskhq/lisk-transactions';
import i18next from 'i18next';
import { getAccount } from './api/lsk/account';
import {
  checkIfInsideLiskApp,
  getAddress,
  getPublicKey,
  signTransaction,
  subscribeToDeviceConnceted,
  subscribeToDeviceDisonnceted,
  subscribeToDevicesList,
  validatePin,
} from '../../libs/hwManager/communication';
import { splitVotesIntoRounds } from './voting';

/**
 * getAccountsFromDevice - Function.
 * This function is used for retrieve the accounts from an hw device, using public keys.
 */
const getAccountsFromDevice = async ({ device: { deviceId }, networkConfig }) => {
  const accounts = [];
  let account = {};
  for (let index = 0; index === accounts.length; index++) {
    // eslint-disable-next-line no-await-in-loop
    const publicKey = await getPublicKey({ index, deviceId });
    // eslint-disable-next-line no-await-in-loop
    account = await getAccount({ networkConfig, publicKey });
    if (index === 0 || accounts[index - 1].balance) {
      accounts.push(account);
    }
  }
  return accounts;
};

/**
 * signSendTransaction - Function.
 * This function is used for sign a send transaction.
 */
const signSendTransaction = async (account, data) => {
  const transactionObject = {
    ...transfer(data),
    senderPublicKey: account.info.LSK.publicKey,
  };

  const transaction = {
    deviceId: account.hwInfo.deviceId,
    index: account.hwInfo.derivationIndex,
    tx: transactionObject,
  };

  try {
    const signature = await signTransaction(transaction);
    const signedTransaction = { ...transactionObject, signature };
    const result = { ...signedTransaction, id: utils.getTransactionId(signedTransaction) };
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * signVoteTransaction - Function.
 * This function is used for sign a vote transaction.
 */
const signVoteTransaction = async (
  account,
  votedList,
  unvotedList,
  timeOffset,
  networkIdentifier,
) => {
  const signedTransactions = [];
  const votesChunks = splitVotesIntoRounds({ votes: [...votedList], unvotes: [...unvotedList] });

  try {
    for (let i = 0; i < votesChunks.length; i++) {
      const transactionObject = {
        ...castVotes({ ...votesChunks[i], timeOffset, networkIdentifier }),
        senderPublicKey: account.publicKey,
        recipientId: account.address, // @todo should we remove this?
      };

      // eslint-disable-next-line no-await-in-loop
      const signature = await signTransaction({
        deviceId: account.hwInfo.deviceId,
        index: account.hwInfo.derivationIndex,
        tx: transactionObject,
      });

      signedTransactions.push({
        ...transactionObject,
        signature,
        // @ todo core 3.x getId
        id: utils.getTransactionId({ ...transactionObject, signature }),
      });
    }

    return signedTransactions;
  } catch (error) {
    throw new Error(i18next.t(
      'The transaction has been canceled on your {{model}}',
      { model: account.hwInfo.deviceModel },
    ));
  }
};

export {
  checkIfInsideLiskApp,
  getAccountsFromDevice,
  getAddress,
  getPublicKey,
  signSendTransaction,
  signVoteTransaction,
  subscribeToDeviceConnceted,
  subscribeToDeviceDisonnceted,
  subscribeToDevicesList,
  validatePin,
};
