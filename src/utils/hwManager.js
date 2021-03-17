// eslint-disable-next-line import/no-unresolved
// import Lisk from '@liskhq/lisk-client';
import i18next from 'i18next';
import { getAccount } from './api/account';
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
    account = await getAccount({ network, publicKey }, 'LSK');
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
const signSendTransaction = async () => {
// const signSendTransaction = async (account, data) => {
  // const { transfer, utils } = Lisk.transaction;
  // const transactionObject = {
  //   ...transfer(data),
  //   senderPublicKey: account.info.LSK ? account.info.LSK.publicKey : null,
  // };

  // const transaction = {
  //   deviceId: account.hwInfo.deviceId,
  //   index: account.hwInfo.derivationIndex,
  //   tx: transactionObject,
  // };

  // try {
  //   const signature = await signTransaction(transaction);
  //   const signedTransaction = { ...transactionObject, signature };
  //   const result = { ...signedTransaction, id: utils.getTransactionId(signedTransaction) };
  //   return result;
  // } catch (error) {
  //   throw new Error(error);
  // }
};

/**
 * signVoteTransaction - Function.
 * This function is used for sign a vote transaction.
 */
const signVoteTransaction = async (
  account,
  votes,
  timeOffset,
  networkIdentifier,
) => {
  // eslint-disable-next-line no-undef
  const { castVotes, utils } = Lisk.transaction;

  try {
    const transactionObject = {
      ...castVotes({ votes, timeOffset, networkIdentifier }),
      senderPublicKey: account.publicKey,
      recipientId: account.address, // @todo should we remove this?
    };

    // eslint-disable-next-line no-await-in-loop
    const signature = await signTransaction({
      deviceId: account.hwInfo.deviceId,
      index: account.hwInfo.derivationIndex,
      tx: transactionObject,
    });

    return {
      ...transactionObject,
      signature,
      // @ todo core 3.x getId
      id: utils.getTransactionId({ ...transactionObject, signature }),
    };
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

    if (!signature) {
      throw new Error(i18next.t(
        'The message signature has been canceled on your {{model}}',
        { model: account.hwInfo.deviceModel },
      ));
    }

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
