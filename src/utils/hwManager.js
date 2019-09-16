// istanbul ignore file
// TODO include unit test
import to from 'await-to-js';
import {
  getPublicKey,
  signTransaction,
  subscribeToDeviceConnceted,
  subscribeToDeviceDisonnceted,
  subscribeToDevicesList,
} from '../../libs/hwManager/communication';
import { calculateTxId, createSendTX } from './rawTransactionWrapper';
import { calculateSecondPassphraseIndex } from '../constants/hwConstants';

/**
 * getAccountsFromDevice - Function.
 * This function is used for retrieve the accounts from an hw device, using publick keys.
 */
const getAccountsFromDevice = async () => {
  // TODO implement logic for this function
  getPublicKey();
  throw new Error('not umplemented');
};

/**
 * signSendTransaction - Function.
 * This function is used for sign a send transaction.
 */
const signSendTransaction = async (account, data, pin = null) => {
  const transactionObject = createSendTX(
    account.info.LSK.publicKey,
    data.recipientId,
    data.amount,
    data.data,
  );

  const index = (typeof pin === 'string' && pin !== '')
    ? calculateSecondPassphraseIndex(account.hwInfo.derivationIndex, pin)
    : account.hwInfo.derivationIndex;

  const transaction = { deviceId: account.hwInfo.deviceId, index, tx: transactionObject };
  const [error, signature] = await to(signTransaction(transaction));

  if (error) throw new Error(error);
  const signedTransaction = { ...transactionObject, signature };
  const result = { ...signedTransaction, id: calculateTxId(signedTransaction) };
  return result;
};

/**
 * signVoteTransaction - Function.
 * This function is used for sign a vote transaction.
 */
const signVoteTransaction = () => {
  // TODO implement logic for this function
  signTransaction();
  throw new Error('not umplemented');
};

export {
  getAccountsFromDevice,
  signSendTransaction,
  signVoteTransaction,
  subscribeToDeviceConnceted,
  subscribeToDeviceDisonnceted,
  subscribeToDevicesList,
};
