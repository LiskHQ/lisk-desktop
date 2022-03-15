import React from 'react';
import { mount } from 'enzyme';
import Dropdown from './dropdown';

describe('Dropdow', () => {
  let wrapper;
  const DummyChild = () => <span />;

  beforeEach(() => {
    wrapper = mount(<Dropdown showDropdown={false}><DummyChild /></Dropdown>);
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
        <Dropdown.Separator key="separator" />,
        <span key="2">Option 2</span>,
      ],
    });
    expect(wrapper.find('.dropdown-content')).toContainMatchingElements(3, 'span');
    expect(wrapper).toContainMatchingElements(2, '.option');
    expect(wrapper).toContainExactlyOneMatchingElement('span.separator');
  });
});
