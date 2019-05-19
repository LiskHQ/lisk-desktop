import React from 'react';
import { shallow } from 'enzyme';
import Selector from './selector';

describe('Selector component', () => {
  let wrapper;
  const props = {
    selectedIndex: 0,
    name: '',
    options: [
      { title: 'option 1' },
      { title: 'option 2' },
      { title: 'option 3' },
    ],
    onSelectorChange: jest.fn(),
  };

  beforeEach(() => {
    wrapper = shallow(<Selector {...props} />);
  });

  it('Should render with 3 options and first option selected', () => {
    expect(wrapper).toContainMatchingElements(3, 'label');
    expect(wrapper.find('input').first().props().checked).toBe(true);
  });

  it('Should update selected option and call onSelectorChange', () => {
    const index = 2;
    wrapper.find('input').last().simulate('change', { target: { value: index } });
    expect(wrapper.find('input').last().props().checked).toBe(true);
    expect(props.onSelectorChange).toBeCalledWith({ index, item: props.options[index] });
  });

  it('Should not render if options <= 1', () => {
    const emptyOptionsProps = {
      ...props,
      options: [],
    };
    wrapper = shallow(<Selector {...emptyOptionsProps} />);
    expect(wrapper).toBeEmptyRender();
  });
});
