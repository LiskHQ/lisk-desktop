// eslint-disable-next-line import/no-unresolved
import i18next from 'i18next';
import { getAccounts } from './api/account';
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
} from '@libs/hwManager/communication';
import { extractAddressFromPublicKey } from './account';

const getAccountBundle = async (deviceId, network, offset) => {
  const publicKeyList = [];

  for (let index = offset; index < offset + 10; index++) {
    // eslint-disable-next-line no-await-in-loop
    const publicKey = await getPublicKey({ index, deviceId });
    publicKeyList.push(publicKey);
  }
  const accounts = await getAccounts({ network, params: { publicKeyList } }, 'LSK');
  return accounts.data.filter(item => item.summary?.address);
};

/**
 * getAccountsFromDevice - Function.
 * This function is used for retrieve the accounts from an hw device, using public keys.
 */
const getAccountsFromDevice = async ({ device: { deviceId }, network }) => {
  let accounts = [];

  for (let index = 0; index <= accounts.length; index += 10) {
    // eslint-disable-next-line no-await-in-loop
    const result = await getAccountBundle(deviceId, network, index);
    // eslint-disable-next-line no-await-in-loop
    accounts = [...accounts, ...result];
  }
  return accounts;
};

const getNewAccountByIndex = async ({ device: { deviceId }, index }) => {
  const publicKey = await getPublicKey({ index, deviceId });

  return {
    summary: {
      publicKey,
      address: extractAddressFromPublicKey(publicKey),
      balance: '0',
    },
  };
};

const isKeyMatch = (aPublicKey, signerPublicKey) => (Buffer.isBuffer(aPublicKey)
  ? aPublicKey.equals(signerPublicKey)
  : Buffer.from(aPublicKey, 'hex').equals(signerPublicKey));

/**
 * updateTransactionSignatures - Function.
 * This function updates transaction object to include the signatures at correct index.
 * The below logic is copied from Lisk SDK https://github.com/LiskHQ/lisk-sdk/blob/2593d1fe70154a9209b713994a252c494cad7123/elements/lisk-transactions/src/sign.ts#L228-L297
 */
/* eslint-disable max-statements, complexity */
const updateTransactionSignatures = (
  account,
  transactionObject,
  signature,
  keys,
) => {
  const isMultiSignatureRegistration = transactionObject.moduleID === 4;
  const signerPublicKey = Buffer.from(account.summary.publicKey, 'hex');
  const isSender = Buffer.isBuffer(transactionObject.senderPublicKey)
    && signerPublicKey.equals(transactionObject.senderPublicKey);
  const { mandatoryKeys, optionalKeys } = keys;
  if (
    mandatoryKeys.length + optionalKeys.length === 0
    || (isSender && isMultiSignatureRegistration)
  ) {
    transactionObject.signatures[0] = signature;
  }

  if (mandatoryKeys.length + optionalKeys.length > 0) {
    const mandatoryKeyIndex = mandatoryKeys.findIndex(
      aPublicKey => isKeyMatch(aPublicKey, signerPublicKey),
    );
    const optionalKeyIndex = optionalKeys.findIndex(
      aPublicKey => isKeyMatch(aPublicKey, signerPublicKey),
    );
    const signatureOffset = isMultiSignatureRegistration ? 1 : 0;
    if (mandatoryKeyIndex !== -1) {
      transactionObject.signatures[mandatoryKeyIndex + signatureOffset] = signature;
    }
    if (optionalKeyIndex !== -1) {
      const index = mandatoryKeys.length + optionalKeyIndex + signatureOffset;
      transactionObject.signatures[index] = signature;
    }
    const numberOfSignatures = signatureOffset + mandatoryKeys.length + optionalKeys.length;
    for (let i = 0; i < numberOfSignatures; i += 1) {
      if (Array.isArray(transactionObject.signatures)
        && transactionObject.signatures[i] === undefined) {
        transactionObject.signatures[i] = Buffer.alloc(0);
      }
    }
  }

  return transactionObject;
};
/* eslint-disable max-statements */

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
    return updateTransactionSignatures(account, transactionObject, signature, keys);
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
  getNewAccountByIndex,
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
