import { passphrase as LiskPassphrase, cryptography } from '@liskhq/lisk-client';
import {
  tokenMap, regex, balanceNeededForReclaim, balanceNeededForInitialization,
} from '@constants';
import { getCustomDerivationKeyPair } from '@utils/explicitBipKeyDerivation';

/**
 * Extracts Lisk PrivateKey/PublicKey pair from a given valid Mnemonic passphrase
 *
 * @param {String} passphrase - Valid Mnemonic passphrase
 * @param {boolean} isRecoveryPhraseMode - enable custom derivation for HW
 * @param {String} derivationPath - custom derivation path for HW
 * @returns {object} - Extracted publicKey for a given valid passphrase
 */
export const extractKeyPair = ({ passphrase, isRecoveryPhraseMode = false, derivationPath }) => {
  if (isRecoveryPhraseMode) {
    const keyPair = getCustomDerivationKeyPair(passphrase, derivationPath);
    return {
      ...keyPair,
      isValid: true,
    };
  }

  if (LiskPassphrase.Mnemonic.validateMnemonic(passphrase)) {
    const keyPair = cryptography.getKeys(passphrase);
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
 * @param {boolean} isRecoveryPhraseMode - enable custom derivation for HW
 * @param {String} derivationPath - custom derivation path for HW
 * @returns {String?} - Extracted publicKey for a given valid passphrase
 */
export const extractPublicKey = (passphrase, isRecoveryPhraseMode = false, derivationPath) => {
  const keyPair = extractKeyPair(passphrase, isRecoveryPhraseMode, derivationPath);

  if (keyPair.isValid) {
    return keyPair.publicKey;
  }

  throw Error('Invalid passphrase');
};

/**
 * Extracts Lisk PrivateKey from a given valid Mnemonic passphrase
 *
 * @param {String} passphrase - Valid Mnemonic passphrase
 * @param {boolean} isRecoveryPhraseMode - enable custom derivation for HW
 * @param {String} derivationPath - custom derivation path for HW
 * @returns {String?} - Extracted PrivateKey for a given valid passphrase
 */
export const extractPrivateKey = (passphrase, isRecoveryPhraseMode = false, derivationPath) => {
  const keyPair = extractKeyPair(passphrase, isRecoveryPhraseMode, derivationPath);

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
export const extractAddressFromPublicKey = (data) => {
  if (regex.publicKey.test(data)) {
    const binaryPublicKey = Buffer.from(data, 'hex');
    return cryptography.getBase32AddressFromPublicKey(binaryPublicKey).toString('hex');
  }
  if (Buffer.isBuffer(data)) {
    return cryptography.getBase32AddressFromPublicKey(data);
  }
  throw Error(`Unable to convert publicKey ${data} to address`);
};

/**
 * Extracts address from Mnemonic passphrase
 *
 * @param {String} data Valid Mnemonic passphrase
 * @returns {String} - address derived from the given passphrase
 */
export const extractAddressFromPassphrase = (data) => {
  if (LiskPassphrase.Mnemonic.validateMnemonic(data)) {
    return cryptography.getBase32AddressFromPassphrase(data).toString('hex');
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
    return cryptography.getBase32AddressFromAddress(data);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    throw Error('Invalid address');
  }
};

export const getAddressFromBase32Address = (data) => {
  try {
    return cryptography.getAddressFromBase32Address(data);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    throw Error('Invalid address');
  }
};

/**
 * This is selector, getting active token account from the Redux store
 *
 * @todo this doesn't return active token, but a mix of entire account
 * @param {Object} state - Redux store state
 * @returns {Object} - account details or empty object
 */
export const getActiveTokenAccount = state => ({
  ...state.account,
  ...((state.account.info && state.account.info[
    state.settings.token?.active
      ? state.settings.token.active
      : tokenMap.LSK.key
  ]) || {}),
});

/**
 * Returns a shorter version of a given address
 * by replacing characters by ellipsis except for
 * the first and last 3.
 * @param {String} address LSk or BTC address
 * @param {String?} size An option of small and medium
 * @returns {String} Truncated address
 */
export const truncateAddress = (address, size = 'small') => {
  if (!address) return address;
  const reg = size === 'small' ? regex.lskAddressTrunk : regex.btcAddressTrunk;
  return address.replace(reg, '$1...$3');
};

/**
 * calculates the balance locked in votes
 *
 * @param {Object} votes - Votes dictionary, values must include vote.confirmed
 * @returns {Number} - Sum of vote amounts
 */
export const calculateBalanceLockedInVotes = (votes = {}) =>
  Object.values(votes).reduce((total, vote) => (total + vote.confirmed), 0);

/**
 * calculates balance locked for the account in unvotes
 *
 * @param {Array} unlocking - unlocking values array from the account details
 * @returns {Number} - Sum of locked LSK, this can be different than sum of vote amounts
 */
export const calculateBalanceLockedInUnvotes = (unlocking = []) =>
  unlocking.reduce((acc, vote) => acc + parseInt(vote.amount, 10), 0);

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
 * returns unlocking objects for broadcasting an unlock transaction
 * at the current height
 *
 * @param {Array} unlocking - unlocking values array from the account details
 * @param {Number} currentBlockHeight - Current block height
 * @returns {Array} Array of LSK rows available to unlock
 */
export const getUnlockableUnlockObjects = (unlocking = [], currentBlockHeight = 0) =>
  unlocking.filter(vote => isBlockHeightReached(vote.height.end, currentBlockHeight))
    .map(vote => ({
      delegateAddress: vote.delegateAddress,
      amount: vote.amount,
      unvoteHeight: Number(vote.height.start),
    }));

/**
 * returns the balance that can be unlocked at the current block height
 *
 * @param {Array} unlocking - unlocking values array from the account details
 * @param {Number} currentBlockHeight - Current block height
 * @returns {Number} - The LSK value that can be unlocked
 */
export const calculateUnlockableBalance = (unlocking = [], currentBlockHeight = 0) =>
  unlocking.reduce(
    (sum, vote) =>
      (isBlockHeightReached(vote.height.end, currentBlockHeight)
        ? sum + parseInt(vote.amount, 10) : sum),
    0,
  );

/**
 * returns the balance that can not be unlocked at the current block height
 *
 * @param {Array} unlocking - unlocking values array from the account details
 * @param {Number} currentBlockHeight - Current block height
 * @returns {Number} - The LSK value that can NOT be unlocked at the current height
 */
export const calculateBalanceUnlockableInTheFuture = (unlocking = [], currentBlockHeight = 0) =>
  unlocking.reduce(
    (sum, vote) =>
      (!isBlockHeightReached(vote.height.end, currentBlockHeight)
        ? sum + parseInt(vote.amount, 10) : sum),
    0,
  );

export const isAccountInitialized = account => account
  && account.info
  && account.info.LSK
  && !!account.info.LSK.serverPublicKey;

export const hasEnoughBalanceForInitialization = (balance = 0) =>
  Number(balance) >= balanceNeededForInitialization;

export const hasEnoughBalanceForReclaim = (balance = 0) =>
  Number(balance) >= balanceNeededForReclaim;

export const calculateRemainingAndSignedMembers = (
  keys = { optionalKeys: [], mandatoryKeys: [] },
  signaturesInTransaction = [],
  ignoreFirstSignature = false,
) => {
  const signatures = ignoreFirstSignature
    ? signaturesInTransaction.slice(1) : signaturesInTransaction;
  const { mandatoryKeys, optionalKeys } = keys;
  const signed = [];
  const remaining = [];

  mandatoryKeys.forEach((key, index) => {
    const hasSigned = Boolean(signatures[index]);
    const value = {
      publicKey: key, mandatory: true, address: extractAddressFromPublicKey(key),
    };

    if (hasSigned) {
      signed.push(value);
    } else {
      remaining.push(value);
    }
  });

  optionalKeys.forEach((key, index) => {
    const hasSigned = Boolean(signatures[index + mandatoryKeys.length]);
    const value = {
      publicKey: key, mandatory: false, address: extractAddressFromPublicKey(key),
    };

    if (hasSigned) {
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
 * @param {boolean} data.isGroupRegistration - tx moduleAsset check
 * @returns {object} - Keys, including number and list of mandatory and optional keys
 */
export const getKeys = ({ senderAccount, transaction, isGroupRegistration }) => {
  if (isGroupRegistration) {
    return transaction.asset;
  }

  return senderAccount.keys;
};
