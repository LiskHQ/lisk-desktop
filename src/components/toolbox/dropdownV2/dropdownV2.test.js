import React from 'react';
import { mount } from 'enzyme';
import DropdownV2 from './dropdownV2';

describe('Dropdown V2', () => {
  let wrapper;
  const DummyChild = () => <span />;

  beforeEach(() => {
    wrapper = mount(<DropdownV2 showDropdown={false}><DummyChild /></DropdownV2>);
  });

  it('Should render with dropdown closed', () => {
    expect(wrapper.find('.dropdown')).not.toHaveClassName('show');
  });

  it('Should open with passed children props', () => {
    const options = ['Option 1', 'Option 2', 'Option 3'];
    wrapper.setProps({
      showDropdown: true,
      children: options.map((option, key) => <span key={key}>{option}</span>),
    });
    expect(wrapper.find('.dropdown')).toHaveClassName('show');
    expect(wrapper.find('.dropdown-content')).toContainMatchingElements(3, 'span');
  });

  it('Should render 2 options with separator between', () => {
    wrapper.setProps({
      showDropdown: true,
      children: [
        <span key="1">Option 1</span>,
        <DropdownV2.Separator key="separator" />,
        <span key="2">Option 2</span>,
      ],
    });
    expect(wrapper.find('.dropdown-content')).toContainMatchingElements(3, 'span');
    expect(wrapper).toContainMatchingElements(2, '.option');
    expect(wrapper).toContainExactlyOneMatchingElement('span.separator');
  });
});
