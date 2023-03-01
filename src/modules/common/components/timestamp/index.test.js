import React from 'react';
import { mount } from 'enzyme';
import moment from 'moment';
import DateTimeFromTimestamp from '.';

describe('packages/views/basics/timestamp', () => {
  const inputValue = 1499983200;

  jest.spyOn(global.Date, 'now').mockImplementation(() => Date.UTC(2017, 1, 15));

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('<DateTimeFromTimestamp time={1499983200} />', () => {
    it('renders "13 Jul 2017" if today is 2017-01-13', () => {
      const wrapper = mount(<DateTimeFromTimestamp time={inputValue} />);
      const dateTime = moment(inputValue * 1000);
      expect(wrapper.text()).toBe(dateTime.format('DD MMM YYYY'));
    });
  });
});
