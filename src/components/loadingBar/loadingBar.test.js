import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import LoadingBar from './loadingBar';


describe('LoadingBar Container', () => {
  it('should show ProgresBar if props.loading.length is not 0', () => {
    const wrapper = mount(<LoadingBar loading={['test']} />);
    expect(wrapper.find('ProgressBar')).to.have.lengthOf(1);
  });

  it('should not show ProgressBar if props.loading.length is 0', () => {
    const wrapper = mount(<LoadingBar loading={[]} />);
    expect(wrapper.find('ProgressBar')).to.have.lengthOf(0);
  });
});
