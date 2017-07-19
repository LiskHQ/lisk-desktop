import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import { Time, TooltipTime, TooltipWrapper } from './index';

sinon.useFakeTimers(new Date(2017, 1, 15).getTime());
describe('<Time />', () => {
  it('expect text of span to be equal of "5 months"', () => {
    const inputValue = 35929631;
    const expectedValue = '5 months';
    const wrapper = shallow(<Time label = {inputValue} />);
    // const html = wrapper.find('span').text();
    expect(wrapper.find('span').text()).to.be.equal(expectedValue);
  });
});

describe('<TooltipWrapper />', () => {
  it('simulates mouseenter events with tooltip', () => {
    const onMouseEnter = sinon.spy();
    const wrapper = mount((
      <TooltipWrapper onMouseEnter={onMouseEnter} tooltip='text'/>
    ));
    wrapper.find(TooltipWrapper).simulate('mouseEnter');
    expect(onMouseEnter.callCount).to.be.equal(1);
  });
});

describe('<TooltipWrapper />', () => {
  it('simulates mouseenter events without tooltip', () => {
    const onMouseEnter = sinon.spy();
    const wrapper = mount((
      <TooltipWrapper/>
    ));
    wrapper.find(TooltipWrapper).simulate('mouseEnter');
    expect(onMouseEnter.callCount).to.be.equal(0);
  });
});

describe('<TooltipTime />', () => {
  it('expect html of Time to be equal "<span>5 months</span>"', () => {
    const inputValue = 35929631;
    const expectedValue = '<span>5 months</span>';
    const wrapper = shallow(<TooltipTime label = {inputValue} />);
    // const html = wrapper.find('span').text();
    expect(wrapper.find(Time).html()).to.be.equal(expectedValue);
  });
});
