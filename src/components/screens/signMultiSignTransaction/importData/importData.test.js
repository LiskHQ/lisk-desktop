import React from 'react';
import { mount } from 'enzyme';
import ImportData from './importData';

describe('Multisignature ImportData component', () => {
  let wrapper;
  const props = {
    t: v => v,
    nextStep: jest.fn(),
  };

  beforeEach(() => {
    wrapper = mount(<ImportData {...props} />);
  });

  it('renders properly', () => {
    const html = wrapper.html();
    expect(wrapper).toContainMatchingElement('header');
    expect(wrapper).toContainMatchingElement('ProgressBar');
    expect(html).toContain('clickableFileInput');
    expect(html).toContain('dropfileInput');
    expect(wrapper).toContainMatchingElement('footer');
    expect(wrapper.find('button.confirm')).toBeDisabled();
  });
});
