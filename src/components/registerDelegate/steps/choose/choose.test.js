import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import Choose from './choose';

describe('Choose', () => {
  let wrapper;
  const props = {
    account: {
    },
    delegate: {
    },
    t: key => key,
  };

  beforeEach(() => {
    wrapper = mount(<Choose {...props} />);
  });

  it('should show invalid chars error for a given invalid username', () => {
    wrapper.setProps({ state: { step: 'choose' } });
    const delegateNameInput = wrapper.find('.delegate-name');
    delegateNameInput.find('input').simulate('change', { target: { value: 'peter%' } });
    expect(wrapper.find('.delegate-name').find('span').at(1)).to.have.text('Characters not allowed: "%"');
  });

  it('should show name too long for a given > 20 chars username', () => {
    wrapper.setProps({ state: { step: 'choose' } });
    const delegateNameInput = wrapper.find('.delegate-name');
    delegateNameInput.find('input').simulate('change', { target: { value: '012345678901234567891' } });
    expect(wrapper.find('.delegate-name').find('span').at(1)).to.have.text('Name too long');
  });
});
