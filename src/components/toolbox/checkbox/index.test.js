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
  };

  beforeEach(() => {
    wrapper = mount(<SliderCheckbox {...props} />);
  });

  it('should render Checkbox', () => {
    expect(wrapper.find(SliderCheckbox)).to.have.lengthOf(1);
  });

  it('checks the checkbox after dragging (more than 50%)', () => {
    expect(wrapper.find('input').instance().checked).to.equal(false);
    wrapper.find('label').props().onMouseDown({ nativeEvent: { clientX: 870 } });
    wrapper.setState({ maxMovement: 158 });

    // When I start dragging the arrow
    wrapper.find('label').props().onMouseMove({ nativeEvent: { clientX: 900 } });
    expect(wrapper.find('.circle span').first().instance().style.left).to.equal('30px');

    // And I keep dragging a bit more
    wrapper.find('label').props().onMouseMove({ nativeEvent: { clientX: 1000 } });
    expect(wrapper.find('.circle span').first().instance().style.left).to.equal('130px');

    // Then the box should not be checked yet
    expect(wrapper.find('input').instance().checked).to.equal(false);

    // When I then 'drop' the arrow
    wrapper.find('label').props().onMouseLeave();

    // The checkbox should be checked
    expect(wrapper.find('input').instance().checked).to.equal(true);
  });

  it('does not check the checkbox after dragging (less than 50%)', () => {
    expect(wrapper.find('input').instance().checked).to.equal(false);
    wrapper.find('label').props().onMouseDown({ nativeEvent: { clientX: 870 } });
    wrapper.setState({ maxMovement: 158 });

    // When I start dragging the arrow
    wrapper.find('label').props().onMouseMove({ nativeEvent: { clientX: 900 } });
    expect(wrapper.find('.circle span').first().instance().style.left).to.equal('30px');

    // When I then 'drop' the arrow
    wrapper.find('label').props().onMouseLeave();

    // The checkbox should not be checked and reset
    expect(wrapper.find('input').instance().checked).to.equal(false);
    expect(wrapper.find('.circle span').first().instance().style.left).to.equal('');
  });
});
