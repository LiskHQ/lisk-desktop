import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import SpinnerV2 from './spinnerV2';

describe('Spinner V2', () => {
  it('should render the spinner and wrapper with given className', () => {
    const wrapper = mount(<SpinnerV2 className={'test'} />);
    expect(wrapper).to.have.className('test');
    expect(wrapper).to.have.descendants('.spinner');
  });

  it('should render the spinner with given label', () => {
    const wrapper = mount(<SpinnerV2 label={'Pending...'} />);
    expect(wrapper).to.have.descendants('.label');
    expect(wrapper.find('.label')).to.have.text('Pending...');
  });
});

