import React from 'react';
import { mount } from 'enzyme';
import { Time, DateFromTimestamp, TimeFromTimestamp } from './index';

describe('components/toolbox/timestamp', () => {
  const inputValue = 35929631;

  describe('<Time label={35929631} />', () => {
    it('renders "5 months" if today is 2017-01-15', () => {
      jest.spyOn(global.Date, 'now').mockImplementation(() =>
        Date.UTC(2017, 1, 15));

      const wrapper = mount(<Time label={inputValue} />);
      expect(wrapper).toHaveText('5 months');
    });
  });

  describe('<DateFromTimestamp time={35929631} />', () => {
    it('renders "Jul 14, 2017"', () => {
      const wrapper = mount(<DateFromTimestamp time={inputValue} />);
      expect(wrapper).toHaveText('Jul 14, 2017');
    });
  });

  describe('<TimeFromTimestamp time={35929631} />', () => {
    it('renders text matching /\\d{1,2}:27:11 [AP]M/', () => {
      const wrapper = mount(<TimeFromTimestamp time={inputValue} />);
      expect(wrapper.text()).toMatch(/\d{1,2}:27:11 [AP]M/);
    });
  });
});
