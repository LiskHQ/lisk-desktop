import React from 'react';
import { mount } from 'enzyme';
import { Time } from './index';

describe('components/toolbox/timestamp', () => {
  const inputValue = 1499983200;

  jest.spyOn(global.Date, 'now').mockImplementation(() => Date.UTC(2017, 1, 15));

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('<Time label={1499983200} />', () => {
    it('renders "5 months" if today is 2017-01-15', () => {
      const wrapper = mount(<Time label={inputValue} />);
      expect(wrapper).toHaveText('5 months');
    });
  });
});
