import React from 'react';
import { shallow } from 'enzyme';
import Feedback from './feedback';

describe('Feedback Component', () => {
  it('Should render with icon and error status', () => {
    const props = {
      showIcon: true,
      status: 'error',
      show: true,
    };
    const wrapper = shallow(<Feedback {...props}>Test Feedback</Feedback>);
    expect(wrapper).toHaveClassName('error show');
    expect(wrapper).toContainExactlyOneMatchingElement('img');
  });

  it('Should render with text but without showing', () => {
    const wrapper = shallow(<Feedback>Test Feedback</Feedback>);
    expect(wrapper).not.toHaveClassName('error show');
    expect(wrapper).toIncludeText('Test Feedback');
  });
});
