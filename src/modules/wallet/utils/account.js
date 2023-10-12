/* eslint-disable max-lines, max-len */
import { passphrase as LiskPassphrase, cryptography } from '@liskhq/lisk-client';
import { regex } from 'src/const/regex';
import i18next from 'i18next';

/**
 * Extracts Lisk PrivateKey/PublicKey pair from a given valid Mnemonic passphrase
 */
export const extractKeyPair = async ({
  passphrase,
  derivationPath,
  enableAccessToLegacyAccounts = false,
}) => {
  if (enableAccessToLegacyAccounts) {
    const keyPair = cryptography.legacy.getKeys(passphrase);
    return {
      publicKey: keyPair.publicKey.toString('hex'),
      privateKey: keyPair.privateKey.toString('hex'),
      isValid: true,
    };
  }

  if (LiskPassphrase.Mnemonic.validateMnemonic(passphrase) && !!derivationPath) {
    const privateKey = await cryptography.ed.getPrivateKeyFromPhraseAndPath(
      passphrase,
      derivationPath
    );
    const publicKey = cryptography.ed.getPublicKeyFromPrivateKey(privateKey).toString('hex');
    return {
      publicKey,
      privateKey: privateKey.toString('hex'),
      isValid: true,
    };
  }
  return { isValid: false };
};

/**
 * Extracts Lisk PublicKey from a given valid Mnemonic passphrase
 */
export const extractPublicKey = async (
  passphrase,
  enableAccessToLegacyAccounts = false,
  derivationPath
) => {
  const keyPair = await extractKeyPair({
    passphrase,
    enableAccessToLegacyAccounts,
    derivationPath,
  });

  if (keyPair.isValid) {
    return keyPair.publicKey;
  }

  throw Error('Invalid passphrase');
};

/**
 * Extracts Lisk PrivateKey from a given valid Mnemonic passphrase
 */
export const extractPrivateKey = async (
  passphrase,
  enableAccessToLegacyAccounts = false,
  derivationPath
) => {
  const keyPair = await extractKeyPair({
    passphrase,
    enableAccessToLegacyAccounts,
    derivationPath,
  });
  if (keyPair.isValid) {
    return keyPair.privateKey;
  }

  throw Error('Invalid passphrase');
};

/**
 * Extracts address from publicKey
 */
export const extractAddressFromPublicKey = (publicKey) => {
  if (regex.publicKey.test(publicKey)) {
    return cryptography.address
      .getLisk32AddressFromPublicKey(Buffer.from(publicKey, 'hex'))
      .toString('hex');
  }
  if (Buffer.isBuffer(publicKey)) {
    return cryptography.address.getLisk32AddressFromPublicKey(publicKey);
  }
  throw Error(`Unable to convert publicKey ${publicKey} to address`);
};

/**
 * Returns a shorter version of a given address
 * by replacing characters by ellipsis except for
 * the first and last 3.
 */
export const truncateAddress = (address, size) => {
  const truncateOptions = ['small', 'medium'];
  const selectedSize = truncateOptions.includes(size) ? size : truncateOptions[0];
  if (!address) return address;
  return address.replace(regex.truncate[selectedSize], '$1...$3');
};

/**
 * Returns a shorter version of a given account name
 * by replacing characters by ellipsis except for
 * the first 6 and last 3.
 */
export const truncateAccountName = (accountName) => {
  if (!accountName) return accountName;
  return accountName.replace(/^(.{3})(.+)?(.{3})$/, '$1...$3');
};

/**
 * Returns a shorter version of a given transactionID
 * by replacing characters by ellipsis except for
 * the first 10 and last 5.
 */
export const truncateTransactionID = (id) => {
  if (!id) return id;
  return id.replace(/^(\w{10})\w+(\w{5})$/g, '$1...$2');
};

export const calculateBalanceLockedInStakes = (stakes = {}) =>
  Object.values(stakes).reduce((total, stake) => total + stake.confirmed, 0);

export const calculateSentStakesAmount = (sentStakes = []) =>
  sentStakes.reduce((total, stake) => total + parseInt(stake.amount, 10), 0);

export const calculateBalanceLockedInUnstakes = (unlocking = []) =>
  unlocking.reduce((acc, stake) => acc + parseInt(stake.amount, 10), 0);

export const calculateUnlockedAmount = (pendingUnlocks = []) =>
  pendingUnlocks.reduce(
    (sum, pendingUnlock) => sum + (pendingUnlock.isLocked ? 0 : parseInt(pendingUnlock.amount, 10)),
    0
  );

export const getLockedPendingUnlocks = (pendingUnlocks = []) =>
  pendingUnlocks?.filter((pendingUnlock) => pendingUnlock.isLocked);

const isSigned = (signature) => signature && signature !== Buffer.alloc(64).toString('hex');

export const calculateRemainingAndSignedMembers = (
  keys = { optionalKeys: [], mandatoryKeys: [] },
  transaction = {},
  isMultisignatureRegistration = false
) => {
  const signatures = isMultisignatureRegistration
    ? transaction.params.signatures
    : transaction.signatures;
  const { mandatoryKeys, optionalKeys } = keys;
  const signed = [];
  const remaining = [];

  mandatoryKeys?.forEach((key, index) => {
    const value = {
      publicKey: key,
      mandatory: true,
      address: extractAddressFromPublicKey(key),
    };

    if (isSigned(signatures[index])) {
      signed.push(value);
    } else {
      remaining.push(value);
    }
  });

  optionalKeys?.forEach((key, index) => {
    const value = {
      publicKey: key,
      mandatory: false,
      address: extractAddressFromPublicKey(key),
    };

    if (isSigned(signatures[index + mandatoryKeys.length])) {
      signed.push(value);
    } else {
      remaining.push(value);
    }
  });

  return { signed, remaining };
};

/**
 * Get keys object from account info or multisig tx asset
 */
export const getKeys = ({ senderAccount, transaction, isRegisterMultisignature }) => {
  if (isRegisterMultisignature) {
    return transaction.params;
  }

  return senderAccount;
};

export const getDerivationPathErrorMessage = (derivationPath) => {
  try {
    cryptography.utils.parseKeyDerivationPath(derivationPath);
  } catch (error) {
    return i18next.t(error.message);
  }
  return undefined;
};
