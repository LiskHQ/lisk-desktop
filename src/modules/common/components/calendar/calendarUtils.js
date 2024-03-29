import moment from 'moment';
import React from 'react';

const defaultOptions = {
  dateFormat: 'DD.MM.YY',
  locale: ['en'],
  amount: 'day',
};

const setLocale = (locale) => {
  const _locale = Array.isArray(locale) ? [...locale, 'en'] : [locale, 'en'];
  moment.locale(_locale);
};

/**
 * Returns if current Date is greater than min Date, based on amount passed on options
 * - defaults to: {dateFormat: 'DD.MM.YY', locale: ['en'], amount: 'day'}
 */
export const canGoToPrevious = (current, min, options = {}) => {
  const _options = { ...defaultOptions, ...options };
  setLocale(_options.locale);
  const minDate = moment(min, _options.dateFormat).startOf('day');
  const newDate = moment(current, _options.dateFormat)
    .subtract(1, _options.amount)
    .endOf(_options.amount);
  return !minDate.isValid() || (newDate.isValid() && newDate > minDate);
};

/**
 * Returns if current Date is less than min Date, based on amount passed on options
 * - defaults to: {dateFormat: 'DD.MM.YY', locale: ['en'], amount: 'day'}
 */
export const canGoToNext = (current, max, options = {}) => {
  const _options = { ...defaultOptions, ...options };
  setLocale(_options.locale);
  const maxDate = moment(max, _options.dateFormat).endOf('day');
  const newDate = moment(current, _options.dateFormat)
    .add(1, _options.amount)
    .startOf(_options.amount);
  return !maxDate.isValid() || (newDate.isValid() && newDate < maxDate);
};

/**
 * Returns true if date isn't between min and max, and should be disabled
 * - defaults to: {dateFormat: 'DD.MM.YY', locale: ['en'], amount: 'day'}
 */
export const shouldBeDisabled = (date, min, max, options = {}) => {
  const _options = { ...defaultOptions, ...options };
  setLocale(_options.locale);
  const minDate = moment(min, _options.dateFormat).startOf('day');
  const maxDate = moment(max, _options.dateFormat).endOf('day');
  const currentDate = moment(date, _options.dateFormat);
  return (
    (currentDate.isValid() &&
      ((minDate.isValid() && currentDate.endOf(_options.amount) < minDate) ||
        (maxDate.isValid() && currentDate.startOf(_options.amount) > maxDate))) ||
    false
  );
};

/**
 * Generate disabled placeholder of days
 * - defaults to: {dateFormat: 'DD.MM.YY', locale: ['en']}
 */
export const generateDayPlaceholder = (count = 0, day, className = '', options = {}) => {
  const _options = { ...defaultOptions, ...options };
  setLocale(_options.locale);
  const _day = moment(day, _options.dateFormat);
  return _day.isValid()
    ? [...Array(count)].map((_, d) => {
        const result = (
          <button key={`button-${d}`} disabled className={className} type="button">
            {_day.format('D')}
          </button>
        );
        _day.add(1, 'days');
        return result;
      })
    : null;
};

export const validations = {
  canGoToPrevious,
  canGoToNext,
  shouldBeDisabled,
};
