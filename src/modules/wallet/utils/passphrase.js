import i18next from 'i18next';
import { inDictionary } from 'src/utils/similarWord';

if (global._bitcore) delete global._bitcore;
const mnemonic = require('bitcore-mnemonic');

/**
 * Generates a passphrase from a given seed array using mnemonic
 *
 * @param {string[]} seed - An array of 16 hex numbers in string format
 * @returns {string} The generated passphrase
 */
export const generatePassphraseFromSeed = ({ seed }) =>
  // eslint-disable-next-line no-buffer-constructor
  new mnemonic(Buffer.from(seed.join(''))).toString();

/**
 * Generates a random passphrase using browser crypto api
 *
 * @returns {string} The generated passphrase
 */
export const generatePassphrase = () => {
  // istanbul ignore next
  const cryptoObj = window.crypto || window.msCrypto;
  return generatePassphraseFromSeed({
    seed: [...cryptoObj.getRandomValues(new Uint16Array(16))].map((x) =>
      `00${(x % 256).toString(16)}`.slice(-2)
    ),
  });
};

/**
 * Checks if passphrase is valid using mnemonic
 *
 * @param {string} passphrase
 * @returns {bool} isValidPassphrase
 */
export const isValidPassphrase = (passphrase) => {
  const normalizedValue = passphrase.replace(/ +/g, ' ').trim();
  let isValid;
  try {
    isValid = normalizedValue.split(' ').length >= 12 && mnemonic.isValid(normalizedValue);
  } catch (e) {
    // If the mnemonic check throws an error, we assume that the
    // passphrase being entered isn't valid
    isValid = false;
  }
  return isValid;
};

export const getPassphraseValidationErrors = (passphrase) => {
  const partialPassphraseError = [];
  const invalidWords = passphrase.filter((word) => {
    const isNotInDictionary = word !== '' && !inDictionary(word);
    partialPassphraseError[passphrase.indexOf(word)] = isNotInDictionary;
    return isNotInDictionary;
  });

  const filteredPassphrase = passphrase.filter((word) => !!word);

  let validationError = i18next.t('Passphrase is not valid');

  if (filteredPassphrase.length < 12) {
    validationError = i18next.t(
      'Passphrase should have 12 words, entered passphrase has {{length}}',
      { length: filteredPassphrase.length }
    );
  }

  if (invalidWords.length > 0) {
    validationError = i18next.t('Please check the highlighted word and make sure it’s correct.');
  }

  return { validationError, partialPassphraseError };
};
