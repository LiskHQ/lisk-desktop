import { cryptography, transactions } from '@liskhq/lisk-client';
import numeral from 'numeral';
import { regex as reg } from 'src/const/regex';
import { MIN_ACCOUNT_BALANCE } from '@transaction/configuration/transactions';
import { convertToBaseDenom } from '@token/fungible/utils/lsk';
import i18n from 'src/utils/i18n/i18n';

/**
 * Validates the given value to be numeric
 */
export const isNumeric = (value) => /^(-?[0-9]+\.?[0-9]*|\.[0-9]+)$/.test(value);

/**
 * Validates the given address
 *
 * @param {String} address
 * @returns {Number} -> 0: valid, 1: invalid, -1: empty
 */
export const validateAddress = (address) => {
  if (address === '') {
    return -1;
  }

  try {
    return cryptography.address.validateLisk32Address(address) ? 0 : 1;
  } catch (e) {
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
 * ZERO, MAX_ACCURACY, FORMAT, STAKE_10X, INSUFFICIENT_FUNDS
 * @param {string} [data.minValue] The minimum value which is the previously confirmed stakes
 * @param {string} [data.inputValue] The user's input for stakes
 * @returns {Object.<string, string|boolean>}
 * data - Object containing the message and if has an error
 *  data.message - Message of the error or empty string
 *  data.error - true or false
 */
export const validateAmountFormat = ({
  value,
  token,
  locale = i18n.language,
  funds,
  checklist = ['ZERO', 'MAX_ACCURACY', 'FORMAT'],
  minValue,
  inputValue,
}) => {
  const { maxFloating } = reg.amount[locale];
  const errors = {
    NEGATIVE_STAKE: {
      message: i18n.t("Stake amount can't be zero or negative."),
      fn: () =>
        numeral(value).value() < minValue ||
        numeral(inputValue).value() < 0 ||
        Object.is(numeral(inputValue).value(), -0),
    },
    NEGATIVE_AMOUNT: {
      message: i18n.t("Amount can't be negative."),
      fn: () => numeral(value).value() < 0,
    },
    ZERO: {
      message: i18n.t("Amount can't be zero."),
      fn: () => numeral(Math.abs(value)).value() === 0,
    },
    FORMAT: {
      message: i18n.t('Provide a correct amount of {{token}}', { token: token?.symbol || '' }),
      fn: () => {
        try {
          transactions.convertToBaseDenom(value.toString(), token);
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
    STAKE_10X: {
      message: i18n.t('You can only stake in multiplies of 10 LSK.'),
      fn: () => value % 10 !== 0,
    },
    INSUFFICIENT_FUNDS: {
      message: i18n.t('Provided amount is higher than your current balance.'),
      fn: () => funds < convertToBaseDenom(numeral(value).value(), token),
    },
    INSUFFICIENT_STAKE_FUNDS: {
      message: i18n.t('The provided amount is higher than your available staking balance.'),
      fn: () => funds < convertToBaseDenom(numeral(value).value(), token),
    },
    MIN_BALANCE: {
      message: i18n.t(
        'Provided amount will result in a wallet with less than the minimum balance.'
      ),
      fn: () => {
        const rawValue = convertToBaseDenom(numeral(value).value(), token);
        return funds - rawValue < MIN_ACCOUNT_BALANCE;
      },
    },
  };

  const errorType = checklist.find((type) => errors[type].fn());
  return {
    error: !!errorType,
    message: errorType ? errors[errorType].message : '',
  };
};
