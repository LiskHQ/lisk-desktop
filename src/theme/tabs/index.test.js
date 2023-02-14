import React from 'react';
import { mount } from 'enzyme';
import Tabs from './index';

describe('Tabs', () => {
  const props = {
    tabs: [{
      value: 'All',
    },
    {
      value: 'Staked',
    }],
    active: 'All',
  };

  it('should render list of length of props.tabs', () => {
    const wrapper = mount(<Tabs {...props} />);
    expect(wrapper.find('li')).toHaveLength(props.tabs.length);
  });

  it('should render empty even if no props.tabs', () => {
    const wrapper = mount(<Tabs />);
    expect(wrapper.find('li')).toHaveLength(0);
  });

  it('should call props.onClick when li clicked', () => {
    const index = 1;
    const onClick = jest.fn();
    const wrapper = mount(<Tabs {...props} onClick={onClick} />);
    (wrapper.find('li').at(index)).simulate('click');
    expect(onClick).toHaveBeenCalledWith(props.tabs[index]);
  });

  it('should not fail if no props.onClick passed when li clicked', () => {
    const index = 1;
    const onClick = jest.fn();
    const wrapper = mount(<Tabs {...props} />);
    (wrapper.find('li').at(index)).simulate('click');
    expect(onClick).not.toHaveBeenCalledWith(props.tabs[index]);
  });
});
