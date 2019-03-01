import moment from 'moment';
import React from 'react';

const defaultOptions = {
  dateFormat: 'DD.MM.YY',
  locale: ['en'],
  amount: 'day',
};

/**
 * Returs if current Date is greater than min Date, based on amount passed on options
 * @param {String|Date} current Value that should be validated
 * @param {String|Date} min Value to validate against
 * @param {Object} options Options to use when parsing date and amount to check.
 * - defaults to: {dateFormat: 'DD.MM.YY', locale: ['en'], amount: 'day'}
 */
export const canGoToPrevious = (current, min, options = {}) => {
  const _options = { ...defaultOptions, ...options };
  const locale = Array.isArray(_options.locale) ? [..._options.locale, 'en'] : [_options.locale, 'en'];
  moment.locale(locale);
  const minDate = moment(min, _options.dateFormat).startOf('day');
  const newDate = moment(current).subtract(1, _options.amount).endOf(_options.amount);
  return !minDate.isValid() || (newDate.isValid() && newDate > minDate);
};

/**
 * Returs if current Date is less than min Date, based on amount passed on options
 * @param {String|Date} current Value that should be validated
 * @param {String|Date} max Value to validate against
 * @param {Object} options Options to use when parsing date and amount to check.
 * - defaults to: {dateFormat: 'DD.MM.YY', locale: ['en'], amount: 'day'}
 */
export const canGoToNext = (current, max, options = {}) => {
  const _options = { ...defaultOptions, ...options };
  const locale = Array.isArray(_options.locale) ? [..._options.locale, 'en'] : [_options.locale, 'en'];
  moment.locale(locale);
  const maxDate = moment(max, _options.dateFormat).endOf('day');
  const newDate = moment(current).add(1, _options.amount).startOf(_options.amount);
  return !maxDate.isValid() || (newDate.isValid() && newDate < maxDate);
};

/**
 * Returs true if date isn't between min and max, and should be disabled
 * @param {String|Date} date Date to check if should be disabled
 * @param {String|Date} min Date to check if greater than
 * @param {String|Date} max Date to check if less than
 * @param {Object} options Options to use when parsing date and amount to check.
 * - defaults to: {dateFormat: 'DD.MM.YY', locale: ['en'], amount: 'day'}
 */
export const shouldBeDisabled = (date, min, max, options = {}) => {
  const _options = { ...defaultOptions, ...options };
  const locale = Array.isArray(_options.locale) ? [..._options.locale, 'en'] : [_options.locale, 'en'];
  moment.locale(locale);
  const minDate = moment(min, _options.dateFormat).startOf('day');
  const maxDate = moment(max, _options.dateFormat).endOf('day');
  const currentDate = moment(date, _options.dateFormat);
  return (currentDate.isValid()
    && ((minDate.isValid() && currentDate.endOf(_options.amount) < minDate)
      || (maxDate.isValid() && currentDate.startOf(_options.amount) > maxDate))) || false;
};

/**
 * Generate disabled placeholder of days
 * @param {Int} count How many placeholder to add
 * @param {Strong|Date} day Initial date to use
 * @param {*} className className to add to placeholder items
 */
export const generateDayPlaceholder = (count, day, className) =>
  [...Array(count)].map((_, d) => {
    const result = <button key={d} disabled={true} className={className}>{day.format('D')}</button>;
    day.add(1, 'days');
    return result;
  });

export const validations = {
  canGoToPrevious,
  canGoToNext,
  shouldBeDisabled,
};

export default {
  validations,
};
