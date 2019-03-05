import React from 'react';
import { shallow } from 'enzyme';
import { validations, generateDayPlaceholder } from './calendarUtils';

describe('Calendar Utils from datepicker', () => {
  describe('validations', () => {
    describe('canGoToPrevious function', () => {
      it('Should return true if currentDate > minDate', () => {
        const date = '01.01.19';
        const minDate = '01.01.18';
        const options = { amount: 'year', locale: ['en'] };
        expect(validations.canGoToPrevious(date, minDate, options)).toBe(true);

        options.amount = 'month';
        expect(validations.canGoToPrevious(date, minDate, options)).toBe(true);
      });

      it('Should return false if currentDate < minDate', () => {
        const date = '01.01.18';
        const minDate = '01.01.19';
        const options = { amount: 'year', locale: ['en'] };
        expect(validations.canGoToPrevious(date, minDate, options)).toBe(false);

        options.amount = 'month';
        expect(validations.canGoToPrevious(date, minDate, options)).toBe(false);
      });

      it('Should return false if any invalid date', () => {
        const date = '30.02.19';
        const minDate = '12.02.19';
        const options = { amount: 'year', locale: 'en' };
        expect(validations.canGoToPrevious(date, minDate, options)).toBe(false);

        options.amount = 'month';
        expect(validations.canGoToPrevious(date, minDate, options)).toBe(false);
      });
    });

    describe('canGoToNext function', () => {
      it('Should return false if currentDate > maxDate', () => {
        const date = '01.01.19';
        const maxDate = '01.01.18';
        const options = { amount: 'year', locale: ['en'] };
        expect(validations.canGoToNext(date, maxDate, options)).toBe(false);

        options.amount = 'month';
        expect(validations.canGoToNext(date, maxDate, options)).toBe(false);
      });

      it('Should return true if currentDate < maxDate', () => {
        const date = '01.01.18';
        const maxDate = '01.01.19';
        const options = { amount: 'year', locale: ['en'] };
        expect(validations.canGoToNext(date, maxDate, options)).toBe(true);

        options.amount = 'month';
        expect(validations.canGoToNext(date, maxDate, options)).toBe(true);
      });

      it('Should return false if any invalid date', () => {
        const date = '30.02.19';
        const maxDate = '12.02.19';
        const options = { amount: 'year', locale: 'en' };
        expect(validations.canGoToNext(date, maxDate, options)).toBe(false);

        options.amount = 'month';
        expect(validations.canGoToNext(date, maxDate, options)).toBe(false);
      });
    });

    describe('shouldBeDisabled function', () => {
      it('Should return false if date is between min and max', () => {
        const date = '11.11.19';
        const min = '10.11.19';
        const max = '12.11.19';
        expect(validations.shouldBeDisabled(date, min, max)).toBe(false);
      });

      it('Should return true if date is not between min and max', () => {
        let date = '13.11.19';
        const min = '10.11.19';
        const max = '12.11.19';
        expect(validations.shouldBeDisabled(date, min, max)).toBe(true);

        date = '09.11.19';
        expect(validations.shouldBeDisabled(date, min, max)).toBe(true);
      });
    });
  });

  describe('generateDayPlaceholder', () => {
    it('Should return null if invalid Date', () => {
      const date = '01.13.19';
      expect(generateDayPlaceholder(0, date)).toBe(null);
    });

    it('Should render placeholder based on count parameter', () => {
      const wrapper = shallow(<div>
        {generateDayPlaceholder(6, '11.02.19', 'test-classname')}
      </div>);

      expect(wrapper).toContainMatchingElements(6, '.test-classname');
    });
  });
});
