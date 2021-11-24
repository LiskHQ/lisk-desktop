import React from 'react';
import { mount } from 'enzyme';
import Form from './form';

describe.skip('Multisignature Form component', () => {
  let wrapper;
  const props = {
    t: v => v,
    nextStep: jest.fn(),
  };

  beforeEach(() => {
    wrapper = mount(<Form {...props} />);
  });

  it('renders properly', () => {
    expect(wrapper).toContainMatchingElement('header');
    expect(wrapper).toContainMatchingElement('ProgressBar');
    expect(wrapper).toContainMatchingElement('.clickableFileInput');
    expect(wrapper).toContainMatchingElement('.textAreaContainer');
    expect(wrapper).toContainMatchingElement('footer');
    expect(wrapper.find('button.confirm')).toBeDisabled();
  });
});
