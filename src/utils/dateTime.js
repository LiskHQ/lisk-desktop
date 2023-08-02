import moment from 'moment';
import { liskGenesisBlockTime } from '@block/const';

/**
 * Returns unix timestamp from value
 *
 * @returns {Number} - timestamp in Unix timestamp format
 */
export const getUnixTimestampFromValue = (value) => +moment(value).format('x') * 1000;

/**
 * returns timestamp from first block not considering time
 * @returns {Number} - Timestamp from first block
 */
export const getDateTimestampFromFirstBlock = (value, format) =>
  (moment(value, format).format('x') - moment(liskGenesisBlockTime).startOf('day').format('x')) /
  1000;

/**
 * Function to format an input to Date format 99.99.99
 * @returns {String} - Value formatted as 99.99.99
 */
export const formatInputToDate = (value, separator = '.') => {
  const suffix = /\d{2}[./-]$/.test(value) ? '.' : '';
  return [
    value
      .replace(/\D/g, '')
      .split('')
      .reduce((acc, digit, idx) => {
        const separatorCounter = acc.split(separator).length;
        const shouldAddSeparator = idx !== 0 && idx % 2 === 0;
        return shouldAddSeparator && separatorCounter < 3
          ? `${acc}${separator}${digit}`
          : `${acc}${digit}`;
      }, ''),
    suffix,
  ]
    .join('')
    .substring(0, 8);
};

/**
 * Converts Unix timestamp (seconds since Jan 01 1970 UTC)
 * to Lisk Epoch timestamp (seconds since May 24 2016, 17:00 UTC).
 * @returns {Number} - Timestamp in seconds from first block
 */
export const convertUnixSecondsToLiskEpochSeconds = (timestamp) =>
  moment(timestamp * 1000).unix() - moment(liskGenesisBlockTime).unix();

/**
 * Converts a date in DD-MM-YYYY format to timestamp
 * @returns {Number} - Unix timestamp
 */
export const transformStringDateToUnixTimestamp = (date) =>
  new Date(moment(date, 'DD-MM-YYYY').format('MM/DD/YYYY')).valueOf() / 1000;

export default {
  convertUnixSecondsToLiskEpochSeconds,
  getDateTimestampFromFirstBlock,
  formatInputToDate,
  liskGenesisBlockTime,
  transformStringDateToUnixTimestamp,
};
