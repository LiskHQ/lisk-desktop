import crypto from 'crypto';

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
const init = (rand = Math.random()) => ({
  step: (160 + Math.floor(rand * 160)) / 100,
  percentage: 0,
  seed: emptyByte('00'),
  byte: emptyByte(0),
});

/**
 * - From a zero byte:
 * - Removes all the 1s and replaces all the 1s with their index
 * - Creates a random number with the length of resulting array (pos)
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
export const generateSeed = ({ byte, seed, percentage, step } = init(), rand = Math.random()) => {
  const available = byte.map((bit, index) => (!bit ? index : null)).filter(bit => (bit !== null));
  const seedIndex = (available.length > 0) ?
    available[parseInt(rand * available.length, 10)] :
    parseInt(rand * byte.length, 10);

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
export const generatePassphrase = ({ seed }) => (new mnemonic(new Buffer(seed.join(''), 'hex'))).toString();

  /**
   * Checks if passphrase is valid using mnemonic
   *
   * @param {string} passphrase
   * @returns {bool} isValidPassphrase
   */
export const isValidPassphrase = (passphrase) => {
  const normalizedValue = passphrase.replace(/ +/g, ' ').trim().toLowerCase();
  return normalizedValue.split(' ').length >= 12 && mnemonic.isValid(normalizedValue);
};
