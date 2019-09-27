import React from 'react';
import { shallow } from 'enzyme';
import DiscreetModeToggle from './discreetModeToggle';

describe('DiscreetModeToggle Component', () => {
  let wrapper;
  const props = {
    className: 'toggle',
    disabledText: 'discreet disabled',
    enabledText: 'discreet enabled',
    iconPosition: 'left',
    isDiscreetMode: false,
    settingsUpdated: jest.fn(),
  };

  const setup = data => shallow(<DiscreetModeToggle {...data} />);

  it('Should render properly with className and disabled discreet Mode', () => {
    wrapper = setup(props);
    expect(wrapper).toContainMatchingElements(1, 'div');
    expect(wrapper).toContainMatchingElements(1, 'label');
    expect(wrapper).toContainMatchingElements(1, 'Icon');
    expect(wrapper).toContainMatchingElements(1, 'span');
    expect(wrapper.find('div')).toHaveClassName('toggle');
    expect(wrapper.find('span')).toHaveText('discreet disabled');
    wrapper.find('label').simulate('click');
    expect(props.settingsUpdated).toBeCalled();
    wrapper.setProps({ isDiscreetMode: true });
    expect(wrapper.find('span')).toHaveText('discreet enabled');
  });

  it('Should render properly with className and enabled discreet Mode', () => {
    const newProps = { ...props, iconPosition: 'right', isDiscreetMode: true };
    wrapper = setup(newProps);
    expect(wrapper).toContainMatchingElements(1, 'div');
    expect(wrapper).toContainMatchingElements(1, 'label');
    expect(wrapper).toContainMatchingElements(1, 'Icon');
    expect(wrapper).toContainMatchingElements(1, 'span');
    expect(wrapper.find('div')).toHaveClassName('toggle');
    expect(wrapper.find('span')).toHaveText('discreet enabled');
    wrapper.find('label').simulate('click');
    expect(props.settingsUpdated).toBeCalled();
    wrapper.setProps({ isDiscreetMode: false });
    expect(wrapper.find('span')).toHaveText('discreet disabled');
  });
});
