// istanbul ignore file
// TODO include unit test
import {
  getPublicKey,
  signTransaction,
  subscribeToDeviceConnceted,
  subscribeToDeviceDisonnceted,
  subscribeToDevicesList,
} from '../../libs/hwManager/communication';

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
const signSendTransaction = () => {
  // TODO implement logic for this function
  signTransaction();
  throw new Error('not umplemented');
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
