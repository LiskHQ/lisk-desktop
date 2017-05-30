import crypto from 'crypto';
import mnemonic from 'bitcore-mnemonic';

/* eslint no-param-reassign: ["error", { "props": false }] */

app.factory('Passphrase', function ($rootScope) {
  this.progress = {
    seed: null,
    percentage: 0,
    step: 0,
  };
  const lastCaptured = {
    coordination: {
      x: 0,
      y: 0,
    },
    time: 0,
  };
  let byte = null;

  const emptyBytes = () => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  /**
   *  Returns a single space separated lower-cased string from a given string.
   *
   * @param {String} [str = ''] - The string to get normalized.
   * @returns {string} - The single space separated lower-cased string
   */
  this.normalize = (str = '') => str.replace(/ +/g, ' ').trim().toLowerCase();

  this.reset = () => {
    this.progress.percentage = 0;
    this.progress.seed = emptyBytes().map(() => '00');
  };

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
   * Checks if given value is a valid passphrase
   *
   * @param {String} value
   * @returns {number} 0, 1, 2, respectively if invalid, valid or empty string.
   */
  this.isValidPassphrase = (value) => {
    const normalizedValue = this.normalize(value);

    if (normalizedValue === '') {
      return 2;
    } else if (normalizedValue.split(' ').length < 12 || !mnemonic.isValid(normalizedValue)) {
      return 0;
    }
    return 1;
  };

  /**
   * Resets previous settings and creates a step with a random length between 1.6% to 3.2%
   */
  this.init = () => {
    this.reset();
    byte = emptyBytes();
    this.progress.step = (160 + Math.floor(Math.random() * 160)) / 100;
  };

  /**
   * - From a zero byte:
   * - Removes all the 1s and replaces all the 1s with their index
   * - Creates a random number with the length of resulting array (pos)
   * - sets the bit in the pos position
   * - creates random byte using crypto and assigns that to seed in the
   *    position of pos
   * - Repeats this until the length of the given byte is zero.
   *
   * @returns {number[]} The input array whose member is pos is set
   */
  const updateSeedAndProgress = () => {
    let pos;
    const available = byte.map((bit, index) => (!bit ? index : null)).filter(bit => (bit !== null));
    if (!available.length) {
      byte = byte.map(() => 0);
      pos = parseInt(Math.random() * byte.length, 10);
    } else {
      pos = available[parseInt(Math.random() * available.length, 10)];
    }

    this.progress.seed[pos] = leftPadd(crypto.randomBytes(1)[0].toString(16), '0', 2);

    /**
     * @todo why it's not working without manual digestion
     */
    if ($rootScope.$$phase !== '$apply' && $rootScope.$$phase !== '$digest') {
      $rootScope.$apply();
    }

    byte[pos] = 1;
    return byte;
  };

  /**
   * Generates a passphrase from a given seed array using mnemonic
   *
   * @param {string[]} seed - An array of 16 hex numbers in string format
   * @returns {string} The generated passphrase
   */
  this.generatePassPhrase = seed => (new mnemonic(new Buffer(seed.join(''), 'hex'))).toString();

  this.listener = (ev, callback) => {
    const distance = Math.sqrt(Math.pow(ev.pageX - lastCaptured.coordination.x, 2) +
    (Math.pow(ev.pageY - lastCaptured.coordination.y), 2));

    if (distance > 120 || ev.isTrigger) {
      for (let p = 0; p < 2; p++) {
        if (this.progress.percentage >= 100) {
          callback(this.progress.seed);
          return;
        }

        if (!ev.isTrigger) {
          lastCaptured.coordination.x = ev.pageX;
          lastCaptured.coordination.y = ev.pageY;
        }

        this.progress.percentage += this.progress.step;
        byte = updateSeedAndProgress(byte);
      }
    }
  };

  return this;
});
