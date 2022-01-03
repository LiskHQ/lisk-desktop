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
    if (index === 0 || accounts[index - 1].summary.balance) {
      accounts.push(account);
    }
  }
  return accounts;
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
    const isMultiSignatureRegistration = transactionObject.moduleID === 4;
    const signerPublicKey = Buffer.from(account.summary.publicKey, 'hex');

    // The signature should included similar non hardware wallet logic
    // The below logic is copied from Lisk SDK https://github.com/LiskHQ/lisk-sdk/blob/2593d1fe70154a9209b713994a252c494cad7123/elements/lisk-transactions/src/sign.ts#L228-L297
    if (isMultiSignatureRegistration &&
      Buffer.isBuffer(transactionObject.senderPublicKey) &&
      signerPublicKey.equals(transactionObject.senderPublicKey)
    ) {
      transactionObject.signatures[0] = signature;
    }

    const { mandatoryKeys, optionalKeys } = transactionObject.asset;
    const mandatoryKeyIndex = mandatoryKeys.findIndex(aPublicKey => aPublicKey.equals(signerPublicKey));
    const optionalKeyIndex = optionalKeys.findIndex(aPublicKey => aPublicKey.equals(signerPublicKey));
    if (mandatoryKeyIndex !== -1) {
      const signatureOffset = isMultiSignatureRegistration ? 1 : 0;
      transactionObject.signatures[mandatoryKeyIndex + signatureOffset] = signature;
    }
    if (optionalKeyIndex !== -1) {
      const signatureOffset = isMultiSignatureRegistration ? 1 : 0;
      transactionObject.signatures[mandatoryKeys.length + optionalKeyIndex + signatureOffset] = signature;
    }

    const numberOfSignatures = (isMultiSignatureRegistration ? 1 : 0) + mandatoryKeys.length + optionalKeys.length;
    for (let i = 0; i < numberOfSignatures; i += 1) {
      if (Array.isArray(transactionObject.signatures) &&
        transactionObject.signatures[i] === undefined) {
        transactionObject.signatures[i] = Buffer.alloc(0);
      }
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
