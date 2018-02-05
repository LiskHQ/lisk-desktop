import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { SliderCheckbox } from './index';

describe('SliderCheckbox without HOC', () => {
  let wrapper;

  const props = {
    icons: { done: 'done' },
    onChange: () => {},
    input: { value: 'introduction-step' },
    theme: {
      sliderInput: 'sliderInput',
    },
    buttonWidth: 40,
    maxMovement: 60,
  };

  beforeEach(() => {
    wrapper = mount(<SliderCheckbox {...props} />);
  });

  it('should render Checkbox', () => {
    expect(wrapper.find(SliderCheckbox)).to.have.lengthOf(1);
  });

  // the values 870, 900 and 1000 are describing the position of the dragged element 
  // 870 being the initial value (not dragged)
  // 900 a bit less than 50% dragged
  // 1000 a bit more than 50% dragged

  // To-do : enable this one when you fix the bug of sliderCheckbox
  it('checks the checkbox after dragging (more than 50%)', () => {
    expect(wrapper.find('input').instance().checked).to.equal(false);
    wrapper.find('label').props().onMouseDown({ nativeEvent: { pageX: 870 } });

    // When I start dragging the arrow
    wrapper.find('label').props().onMouseMove({ nativeEvent: { pageX: 870 } });

    // And I keep dragging a bit more
    wrapper.find('label').props().onMouseMove({ nativeEvent: { pageX: 921 } });
    wrapper.update();
    expect(wrapper.find('.circle span').first().instance().style.left).to.equal('51px');

    // Then the box should not be checked yet
    expect(wrapper.find('input').instance().checked).to.equal(false);

    // When I then 'drop' the arrow
    wrapper.find('label').props().onMouseLeave();

    // The checkbox should be checked
    expect(wrapper.find('input').instance().checked).to.equal(true);
  });

  it('does not check the checkbox after dragging (less than 50%)', () => {
    expect(wrapper.find('input').instance().checked).to.equal(false);
    wrapper.find('label').props().onMouseDown({ nativeEvent: { pageX: 870 } });

    // When I start dragging the arrow
    wrapper.find('label').props().onMouseMove({ nativeEvent: { pageX: 900 } });
    expect(wrapper.find('.circle span').first().instance().style.left).to.equal('30px');

    // When I then 'drop' the arrow
    wrapper.find('label').props().onMouseLeave();

    // The checkbox should not be checked and reset
    expect(wrapper.find('input').instance().checked).to.equal(false);
    expect(wrapper.find('.circle span').first().instance().style.left).to.equal('');
  });
});
