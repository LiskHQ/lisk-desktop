import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { SliderCheckbox } from './index';

describe('SliderCheckbox without HOC', () => {
  const props = {
    icons: { done: 'done' },
    onChange: () => {},
    input: { value: 'introduction-step' },
    theme: {
      sliderInput: 'sliderInput',
      arrowRight: 'arrowRight',
      checkMark: 'checkMark',
      circle: 'circle-theme',
      button: 'button',
    },
    buttonWidth: 40,
    sliderWidth: 300,
  };

  /**
   * Drags the slider for a given length (in pixels) and then updates the wrapper
   * @param {Object} wrapper - Enzyme mounted component
   * @param {Number} delta - The length of movement in pixels. negative values mean sliding to left
   */
  const drag = (wrapper, delta) => {
    wrapper.find('label').props().onMouseDown({ nativeEvent: { pageX: 870 } });

    // When I start dragging the arrow
    wrapper.find('label').props().onMouseMove({ nativeEvent: { pageX: 870 } });

    // And I keep dragging a bit more
    wrapper.find('label').props().onMouseMove({ nativeEvent: { pageX: 870 + delta } });
    wrapper.update();
  };

  const stopDragging = (wrapper) => {
    wrapper.find('label').props().onMouseLeave();
  };

  const shouldBeChecked = (wrapper) => {
    expect(wrapper.find('input').instance().checked).to.equal(true);
  };

  const shouldBeNotChecked = (wrapper) => {
    expect(wrapper.find('input').instance().checked).to.equal(false);
  };

  /**
   * Checks is the button has style.left property set as expected
   * @param {Object} wrapper - Enzyme mounted component
   * @param {String} length - The length of transform including unit, e.g. 15px
   */
  const isItTransformed = (wrapper, length) => {
    expect(wrapper.find('.circle span').first().instance().style.left).to.equal(length);
  };

  it('should render Checkbox', () => {
    const wrapper = mount(<SliderCheckbox {...props} />);
    expect(wrapper.find(SliderCheckbox)).to.have.lengthOf(1);
  });

  // the values 870, 900 and 1000 are describing the position of the dragged element 
  // 870 being the initial value (not dragged)
  // 900 a bit less than 50% dragged
  // 1000 a bit more than 50% dragged

  // To-do : enable this one when you fix the bug of sliderCheckbox
  it('checks the checkbox after dragging (more than 50%)', () => {
    const wrapper = mount(<SliderCheckbox {...props} />);
    shouldBeNotChecked(wrapper);
    drag(wrapper, 51);
    isItTransformed(wrapper, '51px');
    stopDragging(wrapper);
    // The checkbox should be checked
    shouldBeChecked(wrapper);
  });

  it('un-checks the checkbox after dragging (more than 50%) to left', () => {
    const wrapper = mount(<SliderCheckbox {...props} />);
    wrapper.find('input').instance().checked = true;
    shouldBeChecked(wrapper);
    drag(wrapper, -51);
    isItTransformed(wrapper, '249px');
    stopDragging(wrapper);

    // The checkbox should not be checked
    shouldBeNotChecked(wrapper);
  });

  it('does not check the checkbox after dragging (less than 50%)', () => {
    const icons = {
      begin: 'begin',
      goal: 'begin',
      unchecked: 'unchecked',
      checked: 'checked',
    };
    const propsWithIcons = Object.assign({}, props, { icons, textAsIcon: true });
    const wrapper = mount(<SliderCheckbox {...propsWithIcons} />);
    shouldBeNotChecked(wrapper);
    drag(wrapper, 30);
    isItTransformed(wrapper, '30px');
    stopDragging(wrapper);

    shouldBeNotChecked(wrapper);
    isItTransformed(wrapper, '');
  });

  it('has default icons if not defined in props', () => {
    const propsWithNoIcons = Object.assign({}, props);
    delete propsWithNoIcons.icons;

    const wrapper = mount(<SliderCheckbox {...propsWithNoIcons} />);
    expect(wrapper.find('span.arrowRight')).to.have.lengthOf(1);
    expect(wrapper.find('span.checkMark')).to.have.lengthOf(1);
  });

  it('renders a label if defined in props', () => {
    const propsWithArrows = Object.assign({}, props, { label: 'Test slider' });
    const wrapper = mount(<SliderCheckbox {...propsWithArrows} />);
    expect(wrapper.find('span.label')).to.have.lengthOf(1);
  });

  it('renders arrows in the width of slider if defined', () => {
    const propsWithArrows = Object.assign({}, props, { hasSlidingArrows: true, label: 'Test slider' });
    const wrapper = mount(<SliderCheckbox {...propsWithArrows} />);
    expect(wrapper.find('span.arrow')).to.have.lengthOf(1);
  });

  it('handles touch events correctly', () => {
    const wrapper = mount(<SliderCheckbox {...props} />);
    // onTouchStart followed by onTouchEnd without movement
    // works like clicking and checks the checkbox
    wrapper.find('label').props().onTouchStart({ nativeEvent: { changedTouches: [{ pageX: 870 }] } });
    wrapper.find('label').props().onTouchEnd({ nativeEvent: { changedTouches: [{ pageX: 870 }] } });
    shouldBeChecked(wrapper);
  });
});
