import BigNumber from 'bignumber.js';
import numeral from 'numeral';
import 'numeral/locales';

BigNumber.config({ ERRORS: false });
const BASE = 10;

/**
 * Convert Beddow to LSK
 *
 * @param {Strong|Number} value - Value in Beddow
 * @returns {BigNumber} Value converted to LSK
 */
export const fromRawLsk = (value) =>
  new BigNumber(value || 0).dividedBy(new BigNumber(10).pow(8)).toFixed();

/**
 * Converts a given token amount to its token symbol denom
 *
 * @param {BigNumber|number} amount - Amount value to be converted
 * @param {BigNumber|number} token - Token value merged with its equivalent metadata
 * @returns {BigNumber} Amount value converted to the token symbol's denom
 */
export const convertToDenom = (amount, token = {}) => {
  const { decimals } =
    token.denomUnits?.find?.(({ denom }) => denom === token.symbol.toLowerCase()) || {};

  if (!decimals) return '0';

  return new BigNumber(amount || 0).dividedBy(new BigNumber(BASE).pow(decimals)).toFixed();
};

/**
 * Convert LSK to Beddow
 *
 * @param {Strong|Number} value - Value in LSK
 * @returns {BigNumber} Value converted to Beddow
 */
export const toRawLsk = (value) => {
  const amount = numeral(value).value();
  return new BigNumber(amount * new BigNumber(10).pow(8)).decimalPlaces(0).toNumber();
};

const getTokenDecimals = (token) => {
  const { decimals } = token.denomUnits?.find?.(({ denom }) => denom === token.displayDenom) || {};

  return decimals;
};

/**
 * Converts a given token amount to its token symbol denom
 *
 * @param {BigNumber|number} amount - Amount value to be converted
 * @param {BigNumber|number} token - Token value merged with its equivalent metadata
 * @returns {BigNumber} Amount value converted to the token symbol's denom
 */
export const convertFromBaseDenom = (amount, token = {}) => {
  const decimals = getTokenDecimals(token);

  if (!decimals) return '0';

  return new BigNumber(amount || 0).dividedBy(new BigNumber(BASE).pow(decimals)).toFixed();
};

/**
 * Converts from denom denoted by the token symobl to a smaller unit
 *
 * @param {BigNumber|number} amount - Amount value to be converted
 * @param {BigNumber|number} token - Token value merged with its equivalent metadata
 * @returns {BigNumber} Amount value converted from the token symbol's denom
 */
export const convertToBaseDenom = (amount, token = {}) => {
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(amount)) return '0';

  const decimals = getTokenDecimals(token);

  if (!decimals) return '0';

  return new BigNumber(amount || 0).multipliedBy(new BigNumber(BASE).pow(decimals)).toFixed();
};

/**
 * After a new block is created and broadcasted
 * it takes a few ms for Lisk Service
 * to update transactions index, so we need to wait
 * before retrieving the the transaction by blockId
 *
 * @returns {Promise} resolves with True after 100ms
 */
/* istanbul ignore next */
export const delay = (ms = 1500) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
