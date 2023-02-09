// eslint-disable-next-line import/no-unresolved
import i18next from 'i18next';
import {
  checkIfInsideLiskApp,
  getAddress,
  getPublicKey,
  subscribeToDeviceConnected,
  subscribeToDeviceDisconnected,
  subscribeToDevicesList,
  validatePin,
  signMessage,
} from '@libs/hwServer/communication';
import { extractAddressFromPublicKey } from './account';
import { getUsedHWAccounts } from './api';

const getAccountBundle = async (deviceId, network, offset) => {
  const publicKeyList = [];

  for (let index = offset; index < offset + 3; index++) {
    // eslint-disable-next-line no-await-in-loop
    const publicKey = await getPublicKey({ index, deviceId });
    publicKeyList.push(publicKey);
  }
  const accounts = await getUsedHWAccounts(publicKeyList);
  return accounts.filter(item => item.availableBalance);
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
  transaction,
  signature,
) => {
  const isMultisigReg = transaction.module === 4; // @todo fix this
  const signerPublicKey = Buffer.from(account.summary.publicKey, 'hex');
  const isSender = Buffer.isBuffer(transaction.senderPublicKey)
    && signerPublicKey.equals(transaction.senderPublicKey);
  const { mandatoryKeys, optionalKeys } = {}; // @todo get this keys from sender account
  if (
    mandatoryKeys.length + optionalKeys.length === 0
    || (isSender && isMultisigReg)
  ) {
    transaction.signatures[0] = signature;
  }

  if (mandatoryKeys.length + optionalKeys.length > 0) {
    const mandatoryKeyIndex = mandatoryKeys.findIndex(
      aPublicKey => isKeyMatch(aPublicKey, signerPublicKey),
    );
    const optionalKeyIndex = optionalKeys.findIndex(
      aPublicKey => isKeyMatch(aPublicKey, signerPublicKey),
    );
    const signatureOffset = isMultisigReg ? 1 : 0;
    if (mandatoryKeyIndex !== -1) {
      transaction.signatures[mandatoryKeyIndex + signatureOffset] = signature;
    }
    if (optionalKeyIndex !== -1) {
      const index = mandatoryKeys.length + optionalKeyIndex + signatureOffset;
      transaction.signatures[index] = signature;
    }
    const numberOfSignatures = signatureOffset + mandatoryKeys.length + optionalKeys.length;
    for (let i = 0; i < numberOfSignatures; i += 1) {
      if (Array.isArray(transaction.signatures)
        && transaction.signatures[i] === undefined) {
        transaction.signatures[i] = Buffer.alloc(0);
      }
    }
  }

  return transaction;
};
/* eslint-disable max-statements */

const signMessageByHW = async ({
  wallet,
  message,
}) => {
  try {
    const signature = await signMessage({
      deviceId: wallet.hwInfo.deviceId,
      index: wallet.hwInfo.derivationIndex,
      message,
    });

    if (!signature) {
      throw new Error(i18next.t(
        'The message signature has been canceled on your {{model}}',
        { model: wallet.hwInfo.deviceModel },
      ));
    }

    return signature;
  } catch (error) {
    throw new Error(i18next.t(
      'The message signature has been canceled on your {{model}}',
      { model: wallet.hwInfo.deviceModel },
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
  updateTransactionSignatures,
  subscribeToDeviceConnected,
  subscribeToDeviceDisconnected,
  subscribeToDevicesList,
  validatePin,
  signMessageByHW,
};
