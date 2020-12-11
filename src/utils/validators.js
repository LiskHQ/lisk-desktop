import * as bitcoin from 'bitcoinjs-lib';
import numeral from 'numeral';
import { cryptography } from '@liskhq/lisk-client';
import { tokenMap } from '../constants/tokens';
import { minBalance } from '../constants/transactions';
import { toRawLsk } from './lsk';
import i18n from '../i18n';
import reg from './regex';

/**
 * Validates the given address with respect to the tokenType
 * @param {String} tokenType
 * @param {String} address
 * @param {Object} network The network config from Redux store
 * @returns {Number} -> 0: valid, 1: invalid, -1: empty
 */
// eslint-disable-next-line import/prefer-default-export
export const validateAddress = (tokenType, address, network) => {
  if (address === '') {
    return -1;
  }

  switch (tokenType) {
    // Reference: https://github.com/bitcoinjs/bitcoinjs-lib/issues/890
    case tokenMap.BTC.key:
      try {
        bitcoin.address.fromBase58Check(address); // eliminates segwit addresses
        bitcoin.address.toOutputScript(address, network.name);
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
 * @param {string} [data.token="LSK"] The active token
 * @param {string} [data.locale="en"] The locale for testing the format against
 * @param {string?} [data.funds] Maximum funds users are allowed to input
 * @param {Array?} [data.checklist] The list of errors to be tested. A choice of
 * ZERO, MAX_ACCURACY, FORMAT, VOTE_10X, INSUFFICIENT_FUNDS
 * @returns {Object.<string, string|boolean>}
 * data - Object containing the message and if has an error
 *  data.message - Message of the error or empty string
 *  data.error - true or false
 */
export const validateAmountFormat = ({
  value,
  token = 'LSK',
  locale = i18n.language,
  funds,
  checklist = ['ZERO', 'MAX_ACCURACY', 'FORMAT'],
}) => {
  const { format, maxFloating } = reg.amount[locale];

  const errors = {
    ZERO: {
      message: i18n.t('Amount can\'t be zero.'),
      fn: () => numeral(value).value() === 0,
    },
    FORMAT: {
      message: i18n.t('Provide a correct amount of {{token}}', { token }),
      fn: () => format.test(value),
    },
    MAX_ACCURACY: {
      message: i18n.t('Maximum floating point is 8.'),
      fn: () => maxFloating.test(value),
    },
    VOTE_10X: {
      message: i18n.t('You can only vote in multiplies of 10 LSK.'),
      fn: () => value % 10 !== 0,
    },
    INSUFFICIENT_FUNDS: {
      message: i18n.t('Provided amount is higher than your current balance.'),
      fn: () => funds < toRawLsk(numeral(value).value()),
    },
    MIN_BALANCE: {
      message: i18n.t('Provided amount will result in a wallet with less than the minimum balance.'),
      fn: () => {
        const rawValue = toRawLsk(numeral(value).value());
        return funds - rawValue < minBalance;
      },
    },
  };

  const errorType = checklist.find(type => errors[type].fn());
  return {
    error: !!errorType,
    message: errorType ? errors[errorType].message : '',
  };
};
