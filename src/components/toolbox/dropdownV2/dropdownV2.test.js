import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import DropdownV2 from './dropdownV2';

describe('Dropdown V2', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<DropdownV2 showDropdown={false} />);
  });

  it('Should render with dropdown closed', () => {
    expect(wrapper).to.not.have.className('show');
  });

  it('Should open with passed children props', () => {
    const options = ['Option 1', 'Option 2', 'Option 3'];
    wrapper.setProps({
      showDropdown: true,
      children: options.map((option, key) => <span key={key}>{option}</span>),
    });
    expect(wrapper).to.have.className('show');
    expect(wrapper.find('.optionsHolder')).to.have.exactly(3).descendants('span');
  });
});
