import moment from 'moment';

/**
 * Considers time
 * @param {Number} value - Date value
 * @param {String} format - Format in which the date is provided e.g. MM.DD.YY
 * @returns {Number} - Timestamp from first block
 */
export const getTimestampFromFirstBlock = (value, format, options = { inclusive: false }) => {
  const timestamp = options.inclusive ? moment(value, format).endOf('day').format('x') : moment(value, format).format('x');
  return Math.floor((timestamp - moment(new Date(2016, 4, 24, 17, 0, 0, 0)).format('x')) / 1000);
};

/**
 * Without considering time
 * @param {Number} value - Date value
 * @param {String} format - Format in which the date is provided e.g. MM.DD.YY
 * @returns {Number} - Timestamp from first block
 */
export const getDateTimestampFromFirstBlock = (value, format) =>
  (moment(value, format).format('x') - moment(new Date(2016, 4, 24)).format('x')) / 1000;

/**
 * Function to format an input to Date format 99.99.99
 * @param {String} value - Value to format to Date
 * @param {String} separator - Character to use as separator, default: .
 * @returns {String} - Value formated as 99.99.99
 */
export const formatInputToDate = (value, separator = '.') => {
  const suffix = /\d{2}[./-]$/.test(value) ? '.' : '';
  return [
    value.replace(/\D/g, '').split('').reduce((acc, digit, idx) => {
      const separatorCounter = acc.split(separator).length;
      const shouldAddSeparator = idx !== 0 && idx % 2 === 0;
      return (shouldAddSeparator && separatorCounter < 3)
        ? `${acc}${separator}${digit}`
        : `${acc}${digit}`;
    }, ''),
    suffix,
  ].join('').substring(0, 8);
};

export default {
  getTimestampFromFirstBlock,
  getDateTimestampFromFirstBlock,
  formatInputToDate,
};
