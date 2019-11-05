import React from 'react';
import { shallow } from 'enzyme';
import Feedback from './feedback';

describe('Feedback Component', () => {
  it('Should render with icon and error status', () => {
    const props = {
      showIcon: true,
      status: 'error',
      message: 'Test Feedback',
    };
    const wrapper = shallow(<Feedback {...props} />);
    expect(wrapper.find('span').at(0)).toHaveClassName('error');
  });

  it('Should render with text but without showing', () => {
    const wrapper = shallow(<Feedback message="Test Feedback" />);
    expect(wrapper.find('span').at(0)).not.toHaveClassName('error');
    expect(wrapper).toIncludeText('Test Feedback');
  });
});
