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
    t: (k) => k,
  };

  const setup = (data) => shallow(<DiscreetModeToggle {...data} />);

  it('Should render properly with className and disabled discreet Mode', () => {
    wrapper = setup(props);
    expect(wrapper).toContainMatchingElements(1, 'label');
    expect(wrapper).toContainMatchingElements(1, 'span');
    expect(wrapper.find('label')).toHaveClassName('toggle');
    expect(wrapper.find('span')).toHaveText('Enable discreet mode (optional)');
    wrapper.find('.discreetMode').simulate('change', true);
    expect(props.settingsUpdated).toBeCalledWith({ discreetMode: true });
    wrapper.setProps({ isDiscreetMode: true });
  });

  it('Should render properly with className and enabled discreet Mode', () => {
    const newProps = { ...props, iconPosition: 'right', isDiscreetMode: true };
    wrapper = setup(newProps);
    expect(wrapper).toContainMatchingElements(1, 'label');
    expect(wrapper).toContainMatchingElements(1, 'span');
    expect(wrapper.find('label')).toHaveClassName('toggle');
    expect(wrapper.find('span')).toHaveText('Enable discreet mode (optional)');
    wrapper.find('.discreetMode').simulate('change', true);
    expect(props.settingsUpdated).toBeCalledWith({ discreetMode: false });
    wrapper.setProps({ isDiscreetMode: false });
  });
});
