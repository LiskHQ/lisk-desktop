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
    expect(wrapper).toHaveClassName('error show');
    expect(wrapper).toContainExactlyOneMatchingElement('Icon');
  });

  it('Should render with text but without showing', () => {
    const wrapper = shallow(<Feedback message="Test Feedback" />);
    expect(wrapper).not.toHaveClassName('error show');
    expect(wrapper).toIncludeText('Test Feedback');
  });
});
