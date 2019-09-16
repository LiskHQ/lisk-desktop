// istanbul ignore file
// TODO include unit test
import { getAccount } from './api/lsk/account';
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
// eslint-disable-next-line max-statements
const getAccountsFromDevice = async ({ device: { deviceId }, liskAPIClient }) => {
  const accounts = [];
  let account = {};
  for (let index = 0; index === accounts.length; index++) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const publicKey = await getPublicKey({ index, deviceId });
      // eslint-disable-next-line no-await-in-loop
      account = await getAccount({ liskAPIClient, publicKey });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      break;
    }
    if (account.balance) {
      accounts.push(account);
    }
  }
  return accounts;
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
