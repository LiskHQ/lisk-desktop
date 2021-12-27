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
    account = await getAccount({ network, params: { publicKey } }, 'LSK');
    console.log(`#${index}`, publicKey, account.summary.address, account.summary.balance);
    if (index === 0 || accounts[index - 1].summary.balance) {
      accounts.push(account);
    }
  }
  return accounts;
};

/**
 * Returns the index of the current signature in
 * the array of signatures
 *
 * @param {string} publicKey - The hex representation of account publicKey
 * @param {object} keys - The object containing sender account keys
 * @param {object} transactionObject - the raw transaction object
 * @returns {number} the index of the current signature amount the list
 */
const getSignatureIndex = (publicKey, keys, transactionObject) => {
  const buf = JSON.stringify(Buffer.from(publicKey, 'hex'));
  const list = [...keys.mandatoryKeys, ...keys.optionalKeys].map(item => JSON.stringify(item));
  let index = list.indexOf(buf);

  if (transactionObject.moduleID === 4 && transactionObject.assetID === 0) {
    index++;
  }

  return index;
};

/**
 * signTransactionByHW - Function.
 * This function is used for sign a send hardware wallet transaction.
 */
const signTransactionByHW = async (
  account,
  networkIdentifier,
  transactionObject,
  transactionBytes,
  keys,
) => {
  const data = {
    deviceId: account.hwInfo.deviceId,
    index: account.hwInfo.derivationIndex,
    networkIdentifier,
    transactionBytes,
  };

  try {
    const signature = await signTransaction(data);
    const myIndex = getSignatureIndex(account.summary.publicKey, keys, transactionObject);
    if (Array.isArray(transactionObject.signatures) && transactionObject.signatures.length) {
      transactionObject.signatures[myIndex] = signature;
    } else {
      Object.assign(transactionObject, { signatures: [signature] });
    }

    return transactionObject;
  } catch (error) {
    throw new Error(error);
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

export const getDeviceType = (deviceModel = '') => {
  if (/ledger/i.test(deviceModel)) {
    return 'ledgerNano';
  }
  if (/trezor/i.test(deviceModel)) {
    return 'trezor';
  }
  return '';
};

export {
  checkIfInsideLiskApp,
  getAccountsFromDevice,
  getAddress,
  getPublicKey,
  signTransactionByHW,
  subscribeToDeviceConnected,
  subscribeToDeviceDisconnected,
  subscribeToDevicesList,
  validatePin,
  signMessageByHW,
};
