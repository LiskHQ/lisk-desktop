import moment from 'moment';

/**
 * @param {Number} value - Date value
 * @param {String} format - Format in which the date is provided e.g. MM.DD.YY
 * @returns {Number} - Timestamp from first block
 */
export const getTimestampFromFirstBlock = (value, format) =>
  (moment(value, format).format('x') - moment(new Date(2016, 4, 24, 17, 0, 0, 0)).format('x')) / 1000;

export default getTimestampFromFirstBlock;
