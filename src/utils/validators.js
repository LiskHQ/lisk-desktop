import { cryptography } from '@liskhq/lisk-client';
import numeral from 'numeral';
import { regex as reg } from 'src/const/regex';
import {
  convertFromBaseDenom,
  convertToBaseDenom,
  getTokenDecimals,
} from '@token/fungible/utils/helpers';
import i18n from 'src/utils/i18n/i18n';
import { MIN_ACCOUNT_BALANCE } from 'src/modules/transaction/configuration/transactions';

/**
 * Validates the given value to be numeric
 */
export const isNumeric = (value) => /^(-?[0-9]+\.?[0-9]*|\.[0-9]+)$/.test(value);

/**
 * Check if address is in Lisk32 format
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
 * Validate amount against the checklist
 * - Check that only have numbers and commas and points
 * - Validate structure of the value, just one . or ,
 * - Not ending with . or ,
 * - Check that has no more than 8 floating points digits
 */
export const validateAmount = ({
  amount,
  token,
  locale = i18n.language,
  accountBalance,
  checklist = ['ZERO', 'MAX_ACCURACY', 'FORMAT'],
  minValue,
  inputValue,
}) => {
  const { maxDecimals } = reg.amount[locale];
  const errors = {
    NEGATIVE_STAKE: {
      message: i18n.t("Stake amount can't be zero or negative."),
      fn: () =>
        numeral(amount).value() < minValue ||
        numeral(inputValue).value() < 0 ||
        Object.is(numeral(inputValue).value(), -0),
    },
    NEGATIVE_AMOUNT: {
      message: i18n.t("Amount can't be negative."),
      fn: () => numeral(amount).value() < 0,
    },
    ZERO: {
      message: i18n.t("Amount can't be zero."),
      fn: () => numeral(Math.abs(amount)).value() === 0,
    },
    FORMAT: {
      message: i18n.t('Provide a correct amount of {{token}}', { token: token?.symbol || '' }),
      fn: () => {
        try {
          convertToBaseDenom(amount.toString(), token);
          return !isNumeric(amount);
        } catch (error) {
          return true;
        }
      },
    },
    MAX_ACCURACY: {
      message: i18n.t('Maximum allowed decimal point is {{decimal}}.', {
        decimal: getTokenDecimals(token),
      }),
      fn: () => maxDecimals(token).test(amount),
    },
    STAKE_10X: {
      message: i18n.t('You can only stake in multiplies of 10 LSK.'),
      fn: () => amount % 10 !== 0,
    },
    INSUFFICIENT_FUNDS: {
      message: i18n.t('Provided amount is higher than your current balance.'),
      fn: () => BigInt(accountBalance) < BigInt(convertToBaseDenom(numeral(amount).value(), token)),
    },
    INSUFFICIENT_STAKE_FUNDS: {
      message: i18n.t('The provided amount is higher than your available staking balance.'),
      fn: () => BigInt(accountBalance) < BigInt(convertToBaseDenom(numeral(amount).value(), token)),
    },
    MIN_BALANCE: {
      message: i18n.t(
        'Provided amount will result in a wallet with less than the minimum balance.'
      ),
      fn: () => {
        const amountInBase = convertToBaseDenom(numeral(amount).value(), token);
        // TODO: this minimum balance logic should be replaced by actual fee (transaction + cross chain transfer) as one can make 0 balance for an account in Lisk v4
        return MIN_ACCOUNT_BALANCE > BigInt(accountBalance) - BigInt(amountInBase);
      },
    },
    FEE_RANGE: {
      message: i18n.t(`Fee must be greater than {{ maxFee }} and less than {{ minFee }}.`, {
        minFee: convertFromBaseDenom(accountBalance, token),
        maxFee: convertFromBaseDenom(minValue, token),
      }),
      fn: () => {
        const inputFeeValue = BigInt(convertToBaseDenom(amount, token));

        return !(inputFeeValue >= BigInt(minValue) && inputFeeValue <= BigInt(accountBalance));
      },
    },
  };

  const errorType = checklist.find((type) => errors[type].fn());
  return {
    error: !!errorType,
    message: errorType ? errors[errorType].message : '',
  };
};
