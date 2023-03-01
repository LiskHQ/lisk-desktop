/* eslint-disable max-lines, max-len */
import { passphrase as LiskPassphrase, cryptography } from '@liskhq/lisk-client';
import { regex } from 'src/const/regex';
import i18next from 'i18next';

/**
 * Extracts Lisk PrivateKey/PublicKey pair from a given valid Mnemonic passphrase
 *
 * @param {String} passphrase - Valid Mnemonic passphrase
 * @param {boolean} enableCustomDerivationPath - enable custom derivation for HW
 * @param {String} derivationPath - custom derivation path for HW
 * @returns {object} - Extracted publicKey for a given valid passphrase
 */
export const extractKeyPair = async ({
  passphrase, enableCustomDerivationPath = false, derivationPath,
}) => {
  if (enableCustomDerivationPath) {
    const privateKey = await cryptography.ed.getPrivateKeyFromPhraseAndPath(passphrase, derivationPath);
    const publicKey = cryptography.ed.getPublicKeyFromPrivateKey(privateKey).toString('hex');
    return {
      publicKey,
      privateKey: privateKey.toString('hex'),
      isValid: true,
    };
  }

  if (LiskPassphrase.Mnemonic.validateMnemonic(passphrase)) {
    const keyPair = cryptography.legacy.getKeys(passphrase);
    return {
      publicKey: keyPair.publicKey.toString('hex'),
      privateKey: keyPair.privateKey.toString('hex'),
      isValid: true,
    };
  }
  return { isValid: false };
};

/**
 * Extracts Lisk PublicKey from a given valid Mnemonic passphrase
 *
 * @param {String} passphrase - Valid Mnemonic passphrase
 * @param {boolean} enableCustomDerivationPath - enable custom derivation for HW
 * @param {String} derivationPath - custom derivation path for HW
 * @returns {String?} - Extracted publicKey for a given valid passphrase
 */
export const extractPublicKey = async (
  passphrase, enableCustomDerivationPath = false, derivationPath,
) => {
  const keyPair = await extractKeyPair({ passphrase, enableCustomDerivationPath, derivationPath });

  if (keyPair.isValid) {
    return keyPair.publicKey;
  }

  throw Error('Invalid passphrase');
};

/**
 * Extracts Lisk PrivateKey from a given valid Mnemonic passphrase
 *
 * @param {String} passphrase - Valid Mnemonic passphrase
 * @param {boolean} enableCustomDerivationPath - enable custom derivation for HW
 * @param {String} derivationPath - custom derivation path for HW
 * @returns {String?} - Extracted PrivateKey for a given valid passphrase
 */
export const extractPrivateKey = async (
  passphrase, enableCustomDerivationPath = false, derivationPath,
) => {
  const keyPair = await extractKeyPair({ passphrase, enableCustomDerivationPath, derivationPath });
  if (keyPair.isValid) {
    return keyPair.privateKey;
  }

  throw Error('Invalid passphrase');
};

/**
 * Extracts address from publicKey
 *
 * @param {String} data PublicKey in Hex
 * @returns {String} - address derived from the given publicKey
 */
export const extractAddressFromPublicKey = (publicKey) => {
  if (regex.publicKey.test(publicKey)) {
    return cryptography.address.getLisk32AddressFromPublicKey(Buffer.from(publicKey, 'hex')).toString('hex');
  }
  if (Buffer.isBuffer(publicKey)) {
    return cryptography.address.getLisk32AddressFromPublicKey(publicKey);
  }
  throw Error(`Unable to convert publicKey ${publicKey} to address`);
};

/**
 * Extracts address from Mnemonic passphrase
 *
 * @param {String} data Valid Mnemonic passphrase
 * @returns {String} - address derived from the given passphrase
 */
export const extractAddressFromPassphrase = (data) => {
  if (LiskPassphrase.Mnemonic.validateMnemonic(data)) {
    const { publicKey } = cryptography.legacy.getKeys(data);
    return cryptography.address.getLisk32AddressFromPublicKey(publicKey).toString('hex');
  }
  throw Error('Invalid passphrase');
};

/**
 * Extracts Lisk address from given passphrase or publicKey
 *
 * @param {String} data - passphrase or public key
 * @returns {String?} - Extracted address for a given valid passphrase or publicKey
 */
export const getBase32AddressFromAddress = (data) => {
  try {
    return cryptography.address.getLisk32AddressFromAddress(data);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    throw Error('Invalid address');
  }
};

export const getAddressFromBase32Address = (data) => {
  try {
    return cryptography.address.getAddressFromLisk32Address(data);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    throw Error('Invalid address');
  }
};

/**
 * Returns a shorter version of a given address
 * by replacing characters by ellipsis except for
 * the first and last 3.
 * @param {String} address LSk address
 * @param {String?} size An option of small and medium
 * @returns {String} Truncated address
 */
export const truncateAddress = (address, size) => {
  const truncateOptions = ['small', 'medium'];
  const selectedSize = truncateOptions.includes(size) ? size : truncateOptions[0];
  if (!address) return address;
  return address.replace(regex.truncate[selectedSize], '$1...$3');
};

/**
 * Returns a shorter version of a given transactionID
 * by replacing characters by ellipsis except for
 * the first 10 and last 5.
 * @param {String} id transactionID
 * @returns {String} Truncated transactionID
 */
export const truncateTransactionID = (id) => {
  if (!id) return id;
  return id.replace(/^(\w{10})\w+(\w{5})$/g, '$1...$2');
};

/**
 * calculates the balance locked in stakes
 *
 * @param {Object} stakes - Stakes dictionary, values must include stake.confirmed
 * @returns {Number} - Sum of stake amounts
 */
export const calculateBalanceLockedInStakes = (stakes = {}) =>
  Object.values(stakes).reduce((total, stake) => (total + stake.confirmed), 0);

export const calculateSentStakesAmount = (sentStakes = []) =>
  sentStakes.reduce((total, stake) => (total + parseInt(stake.amount, 10)), 0);

/**
 * calculates balance locked for the account in unstakes
 *
 * @param {Array} unlocking - unlocking values array from the account details
 * @returns {Number} - Sum of locked LSK, this can be different than sum of stake amounts
 */
export const calculateBalanceLockedInUnstakes = (unlocking = []) =>
  unlocking.reduce((acc, stake) => acc + parseInt(stake.amount, 10), 0);

/**
 * Checks if given unlocking item can be unlocked
 * (Checks if the current height is greater than the unlocking height)
 *
 * @param {Number} unlockHeight - The height at which given LSK can be unlocked
 * @param {Number} currentBlockHeight - Current block height
 * @returns {Boolean} - True if the height is there
 */
export const isBlockHeightReached = (unlockHeight, currentBlockHeight) =>
  currentBlockHeight >= unlockHeight;

/**
 * returns total amount that can be unlocked
 *
 * @param {Array} pendingUnlocks - pendingUnlocks array
 * @returns {Number} - Total amount that can be unlocked
 */
export const calculateUnlockedAmount = (pendingUnlocks = []) =>
  pendingUnlocks.reduce(
    (sum, pendingUnlock) => (sum + (pendingUnlock.isLocked ? 0 : parseInt(pendingUnlock.amount, 10))),
    0
  );

export const getLockedPendingUnlocks = (pendingUnlocks = []) =>
  pendingUnlocks?.filter((pendingUnlock) => pendingUnlock.isLocked);

/**
 * returns the balance that can not be unlocked at the current block height
 *
 * @param {Array} unlocking - unlocking values array from the account details
 * @param {Number} currentBlockHeight - Current block height
 * @returns {Number} - The LSK value that can NOT be unlocked at the current height
 */
export const calculateBalanceUnlockableInTheFuture = (unlocking = [], currentBlockHeight = 0) =>
  unlocking.reduce(
    (sum, stake) =>
    (!isBlockHeightReached(stake.expectedUnlockableHeight, currentBlockHeight)
      ? sum + parseInt(stake.amount, 10) : sum),
    0,
  );

const isSigned = signature => signature && signature !== Buffer.alloc(64).toString('hex');

export const calculateRemainingAndSignedMembers = (
  keys = { optionalKeys: [], mandatoryKeys: [] },
  transaction = {},
  isMultisignatureRegistration = false,
) => {
  const signatures = isMultisignatureRegistration
    ? transaction.params.signatures : transaction.signatures;
  const { mandatoryKeys, optionalKeys } = keys;
  const signed = [];
  const remaining = [];

  mandatoryKeys.forEach((key, index) => {
    const value = {
      publicKey: key, mandatory: true, address: extractAddressFromPublicKey(key),
    };

    if (isSigned(signatures[index])) {
      signed.push(value);
    } else {
      remaining.push(value);
    }
  });

  optionalKeys.forEach((key, index) => {
    const value = {
      publicKey: key, mandatory: false, address: extractAddressFromPublicKey(key),
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
 * @param {object} data
 * @param {object} data.senderAccount - Account info
 * @param {object} data.transaction - Transaction details
 * @param {boolean} data.isRegisterMultisignature - tx moduleAsset check
 * @returns {object} - Keys, including number and list of mandatory and optional keys
 */
export const getKeys = ({ senderAccount, transaction, isRegisterMultisignature }) => {
  if (isRegisterMultisignature) {
    return transaction.params;
  }

  return senderAccount;
};

export const validate2ndPass = async (account, passphrase, error) => {
  const messages = [];
  if (error) {
    messages.push(messages);
    return messages;
  }

  const secondPublicKey = account.keys.mandatoryKeys
    .filter(item => item !== account.summary.publicKey);
  const publicKey = await extractPublicKey(passphrase);
  // compare them
  if (!secondPublicKey.length || publicKey !== secondPublicKey[0]) {
    messages.push('This passphrase does not belong to your account.');
  }
  return messages;
};

/**
 * Validate a derivation path
 * @param {string} derivationPath
 * @returns {string} - undefined/error
 */
export const getDerivationPathErrorMessage = (derivationPath) => {
  try {
    cryptography.utils.parseKeyDerivationPath(derivationPath);
  } catch (error) {
    return i18next.t(error.message);
  }
  return undefined;
};
