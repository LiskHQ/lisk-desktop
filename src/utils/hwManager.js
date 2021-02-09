// eslint-disable-next-line import/no-unresolved
import lisk from 'Utils/lisk-client';
import i18next from 'i18next';
import { getAccount } from './api/lsk/account';
import {
  checkIfInsideLiskApp,
  getAddress,
  getPublicKey,
  signTransaction,
  subscribeToDeviceConnected,
  subscribeToDeviceDisconnected,
  subscribeToDevicesList,
  validatePin,
  signMessage,
} from '../../libs/hwManager/communication';
import { splitVotesIntoRounds } from './voting';

/**
 * getAccountsFromDevice - Function.
 * This function is used for retrieve the accounts from an hw device, using public keys.
 */
const getAccountsFromDevice = async ({ device: { deviceId }, network }) => {
  const accounts = [];
  let account = {};
  for (let index = 0; index === accounts.length; index++) {
    // eslint-disable-next-line no-await-in-loop
    const publicKey = await getPublicKey({ index, deviceId });
    // eslint-disable-next-line no-await-in-loop
    account = await getAccount({ network, publicKey });
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
const signSendTransaction = async (account, data, apiVersion) => {
  const { transfer, utils } = lisk(apiVersion).transaction;
  const transactionObject = {
    ...transfer(data),
    senderPublicKey: account.info.LSK ? account.info.LSK.publicKey : null,
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
  const { castVotes, utils } = lisk('2').transaction;
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

const signMessageByHW = async ({
  account,
  message,
}) => {
  try {
    const signature = await signMessage({
      deviceId: account.hwInfo.deviceId,
      index: account.hwInfo.derivationIndex,
      message,
    });

    return signature;
  } catch (error) {
    throw new Error(i18next.t(
      'The message signature has been canceled on your {{model}}',
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
  subscribeToDeviceConnected,
  subscribeToDeviceDisconnected,
  subscribeToDevicesList,
  validatePin,
  signMessageByHW,
};
