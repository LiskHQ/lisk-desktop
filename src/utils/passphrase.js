import crypto from 'crypto';
import i18next from 'i18next';
import { inDictionary } from './similarWord';

if (global._bitcore) delete global._bitcore;
const mnemonic = require('bitcore-mnemonic');

/**
 * Generates an array of 16 members equal to given value
 *
 * @param {Number|String} value
 * @returns {Array} - Array of 16 'value's
 */
export const emptyByte = (value) => Array.apply(null, Array(16)).map(item => value); //eslint-disable-line

/**
 * fills the left side of str with a given padding string to meet the required length
 *
 * @param {String} str - The string to fill with pad
 * @param {String} pad - The string used as padding
 * @param {Number} length  - The final length of the string after adding padding
 * @private
 * @returns {string} padded string
 */
const leftPadd = (str, pad, length) => {
  let paddedStr = str;
  while (paddedStr.length < length) paddedStr = pad + paddedStr;
  return paddedStr;
};

/**
 * Resets previous settings and creates a step with a random length between 1.6% to 3.2%
 */
const init = (rand = Math.random()) => {
  const step = (160 + Math.floor(rand * 160)) / 100;
  return {
    step,
    percentage: 0,
    seed: emptyByte('00'),
    byte: emptyByte(0),
  };
};

/**
 * - From a zero byte:
 * - Removes all the 1s and replaces all the 0s with their index
 * - Creates a random index (pos) of the resulting array
 * - sets the bit in the pos position
 * - creates random byte using crypto and assigns that to seed in the
 *    position of pos
 * - Repeats this until the length of the given byte is zero.
 *
 * @param {Array} byte - Array of 16 numbers
 * @param {Array} seed - Array of 16 hex numbers in String format
 * @param {Number} percentage
 * @param {Number} step
 *
 * @returns {number[]} The input array whose member is pos is set
 */
export const generateSeed = ({
  byte, seed, percentage, step,
} = init(), rand = Math.random()) => {
  const available = byte.map((bit, idx) => (!bit ? idx : null)).filter(idx => (idx !== null));
  const seedIndex = (available.length > 0) ?
    available[Math.floor(rand * available.length)] :
    Math.floor(rand * byte.length);

  const content = leftPadd(crypto.randomBytes(1)[0].toString(16), '0', 2);

  return {
    seed: seed.map((item, idx) => ((idx === seedIndex) ? content : item)),
    byte: available.length > 0 ? byte.map((item, idx) =>
      ((idx === seedIndex) ? 1 : item)) : emptyByte(0),
    percentage: (percentage + step),
    step,
  };
};

  /**
   * Generates a passphrase from a given seed array using mnemonic
   *
   * @param {string[]} seed - An array of 16 hex numbers in string format
   * @returns {string} The generated passphrase
   */
// eslint-disable-next-line no-buffer-constructor
export const generatePassphrase = ({ seed }) => (new mnemonic(new Buffer(seed.join(''), 'hex'))).toString();

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
  const passphraseArray = passphrase.trim().split(' ');

  const partialPassphraseError = [];
  const invalidWords = passphraseArray.filter((word) => {
    const isNotInDictionary = !inDictionary(word);
    partialPassphraseError[passphraseArray.indexOf(word)] = isNotInDictionary;
    return isNotInDictionary;
  });

  let validationError = i18next.t('Passphrase is not valid');

  if (passphraseArray.length < 12) {
    validationError = i18next.t('Passphrase should have 12 words, entered passphrase has {{length}}', { length: passphraseArray.length });
  }

  if (invalidWords.length > 0) {
    validationError = i18next.t('Please check the highlighted words');
  }

  return { validationError, partialPassphraseError };
};
