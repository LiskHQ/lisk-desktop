import * as bitcoin from 'bitcoinjs-lib';
import numeral from 'numeral';
import { cryptography } from '@liskhq/lisk-client';
import { tokenMap } from '../constants/tokens';
import getBtcConfig from './api/btc/config';
import i18n from '../i18n';
import reg from './regex';

/**
 * Validates the given address with respect to the tokenType
 * @param {String} tokenType
 * @param {String} address
 * @param {Number} [netCode=1]
 * @returns {Number} -> 0: valid, 1: invalid, -1: empty
 */
// eslint-disable-next-line import/prefer-default-export
export const validateAddress = (tokenType, address, netCode = 1) => {
  if (address === '') {
    return -1;
  }

  switch (tokenType) {
    // Reference: https://github.com/bitcoinjs/bitcoinjs-lib/issues/890
    case tokenMap.BTC.key:
      try {
        const config = getBtcConfig(netCode);
        bitcoin.address.fromBase58Check(address); // eliminates segwit addresses
        bitcoin.address.toOutputScript(address, config.network);
        return 0;
      } catch (e) {
        return 1;
      }

    case tokenMap.LSK.key:
    default:
      return reg.address.test(address) ? 0 : 1;
  }
};

export const validateLSKPublicKey = (address) => {
  try {
    cryptography.getAddressFromPublicKey(address);
    return 0;
  } catch (e) {
    return 1;
  }
};

/**
 * Validate the format of the value param
 * - Check that only have numbers and commas and points
 * - Validate structure of the value, just one . or ,
 * - Not ending with . or ,
 * - Check that has no more than 8 floating points digits
 * @param {Object.<string, srting>} data
 * @param {string} data.value
 * @param {string} [data.token="LSK"]
 * @param {string} [data.locale="en"]
 * @returns {Object.<string, string|boolean>}
 * data - Object containing the message and if has an error
 *  data.message - Message of the error or empty string
 *  data.error - true or false
 */
export const validateAmountFormat = ({
  value,
  token = 'LSK',
  locale = i18n.language,
}) => {
  const errors = {
    INVALID: i18n.t('Provide a correct amount of {{token}}', { token }),
    FLOATING_POINT: i18n.t('Maximum floating point is 8.'),
  };
  const { format, maxFloating } = reg.amount[locale];
  const message = (
    (format.test(value) || numeral(value).value() === 0) && errors.INVALID)
    || (maxFloating.test(value) && errors.FLOATING_POINT)
    || '';
  return {
    error: !!message,
    message,
  };
};
