import BigNumber from 'bignumber.js';
import numeral from 'numeral';
import 'numeral/locales';

BigNumber.config({ ERRORS: false });

/**
 * Convert Beddow / Satoshi to LSK / BTC
 *
 * @param {Strong|Number} value - Value in Beddow or Satoshi
 * @returns {BigNumber} Value converted to LSK / BTC
 */
export const fromRawLsk = value => (
  new BigNumber(value || 0).dividedBy(new BigNumber(10).pow(8)).toFixed()
);

/**
 * Convert LSK / BTC to Beddow / Satoshi
 *
 * @param {Strong|Number} value - Value in LSK / BTC
 * @returns {BigNumber} Value converted to Beddow / Satoshi
 */
export const toRawLsk = (value) => {
  const amount = numeral(value).value();
  return new BigNumber(amount * new BigNumber(10).pow(8)).decimalPlaces(0).toNumber();
};
