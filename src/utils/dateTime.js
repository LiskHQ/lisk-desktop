import moment from 'moment';
import { firstBlockTime } from '@block/utils/firstBlockTime';

/**
 * Returns unix timestamp from value
 * @param {Number} value - Date value
 * @returns {Number} - timestamp in Unix timestamp format
 */
export const getUnixTimestampFromValue = (value) => +moment(value).format('x') * 1000;

/**
 * returns timestamp from first block not considering time
 * @param {Number} value - Date value
 * @param {String} [format] - Format in which the date is provided e.g. MM.DD.YY
 * @returns {Number} - Timestamp from first block
 */
export const getDateTimestampFromFirstBlock = (value, format) =>
  (moment(value, format).format('x') - moment(firstBlockTime).startOf('day').format('x')) / 1000;

/**
 * Function to format an input to Date format 99.99.99
 * @param {String} value - Value to format to Date
 * @param {String} separator - Character to use as separator, default: .
 * @returns {String} - Value formated as 99.99.99
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
 * @param {Number} timmestamp - Unix timestamp in seconds
 * @returns {Number} - Timestamp in seconds from first block
 */
export const convertUnixSecondsToLiskEpochSeconds = (timestamp) =>
  moment(timestamp * 1000).unix() - moment(firstBlockTime).unix();

/**
 * Converts a date in DD-MM-YYYY format to timestamp
 * @param {String} date - Date in DD-MM-YYYY format
 * @returns {Number} - Unix timestamp
 */
export const transformStringDateToUnixTimestamp = (date) =>
  new Date(moment(date, 'DD-MM-YYYY').format('MM/DD/YYYY')).valueOf() / 1000;

export default {
  convertUnixSecondsToLiskEpochSeconds,
  getDateTimestampFromFirstBlock,
  formatInputToDate,
  firstBlockTime,
  transformStringDateToUnixTimestamp,
};
