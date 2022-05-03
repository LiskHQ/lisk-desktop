import * as bitcoin from 'bitcoinjs-lib';
import { cryptography, transactions } from '@liskhq/lisk-client';
import numeral from 'numeral';

import { regex as reg } from '@common/configuration';
import { tokenMap } from '@token/configuration/tokens';
import { MIN_ACCOUNT_BALANCE } from '@transaction/configuration/transactions';
import { toRawLsk } from '@token/utilities/lsk';
import i18n from 'src/utils/i18n/i18n';

/**
 * Validates the given value to be numeric
 */
export const isNumeric = (value) => /^(-?[0-9]+\.?[0-9]*|\.[0-9]+)$/.test(value);

/**
 * Validates the given address with respect to the tokenType
 * @param {String} tokenType
 * @param {String} address
 * @param {Object} network The network config from Redux store
 * @returns {Number} -> 0: valid, 1: invalid, -1: empty
 */
export const validateAddress = (tokenType, address, network) => {
  if (address === '') {
    return -1;
  }

  switch (tokenType) {
    // Reference: https://github.com/bitcoinjs/bitcoinjs-lib/issues/890
    case tokenMap.BTC.key:
      try {
        bitcoin.address.fromBase58Check(address); // eliminates segwit addresses
        bitcoin.address.toOutputScript(address, network.networks.BTC.network);
        return 0;
      } catch (e) {
        return 1;
      }

    case tokenMap.LSK.key:
      try {
        return cryptography.validateBase32Address(address) ? 0 : 1;
      } catch (e) {
        return 1;
      }
    default:
      return 1;
  }
};

/**
 * Checks the validity of a given publicKey
 *
 * @param {String} publicKey - The publicKey to validate
 * @returns {Number} 0 for valid, 1 for invalid
 */
export const validateLSKPublicKey = (publicKey) => {
  try {
    return reg.publicKey.test(publicKey) ? 0 : 1;
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
 * @param {Object.<string, string>} data
 * @param {string} data.value
 * @param {string} [data.token="LSK"] The active token
 * @param {string} [data.locale="en"] The locale for testing the format against
 * @param {string?} [data.funds] Maximum funds users are allowed to input
 * @param {Array?} [data.checklist] The list of errors to be tested. A choice of
 * ZERO, MAX_ACCURACY, FORMAT, VOTE_10X, INSUFFICIENT_FUNDS
 * @param {string} [data.minValue] The minimum value which is the previously confirmed votes
 * @param {string} [data.inputValue] The user's input for votes
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
  minValue,
  inputValue,
}) => {
  const { maxFloating } = reg.amount[locale];
  const errors = {
    NEGATIVE_VOTE: {
      message: i18n.t('Vote amount can\'t be zero or negative.'),
      fn: () =>
        numeral(value).value() < minValue
        || numeral(inputValue).value() < 0
        || Object.is(numeral(inputValue).value(), -0),
    },
    NEGATIVE_AMOUNT: {
      message: i18n.t('Amount can\'t be negative.'),
      fn: () => numeral(value).value() < 0,
    },
    ZERO: {
      message: i18n.t('Amount can\'t be zero.'),
      fn: () => numeral(Math.abs(value)).value() === 0,
    },
    FORMAT: {
      message: i18n.t('Provide a correct amount of {{token}}', { token }),
      fn: () => {
        try {
          // converting LSK to Beddows will ensure the value is under beddows
          transactions.convertLSKToBeddows(value.toString());
          return !isNumeric(value);
        } catch (error) {
          return true;
        }
      },
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
    INSUFFICIENT_VOTE_FUNDS: {
      message: i18n.t('The provided amount is higher than available voting balance.'),
      fn: () => funds < toRawLsk(numeral(value).value()),
    },
    MIN_BALANCE: {
      message: i18n.t('Provided amount will result in a wallet with less than the minimum balance.'),
      fn: () => {
        const rawValue = toRawLsk(numeral(value).value());
        return funds - rawValue < MIN_ACCOUNT_BALANCE;
      },
    },
  };

  const errorType = checklist.find(type => errors[type].fn());
  return {
    error: !!errorType,
    message: errorType ? errors[errorType].message : '',
  };
};
