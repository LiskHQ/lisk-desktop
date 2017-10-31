import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import PropTypes from 'prop-types';
import i18n from '../../i18n';
import { Time, TooltipTime, TooltipWrapper } from './index';

sinon.useFakeTimers({
  now: new Date(2017, 1, 15).getTime(),
  toFake: ['setTimeout', 'clearTimeout', 'Date'],
});
describe('Time', () => {
  it('shows "5 months" for the equivalent timestamp (35929631)', () => {
    const inputValue = 35929631;
    const expectedValue = '5 months';
    const wrapper = mount(<Time label = {inputValue} />, {
      context: { i18n },
      childContextTypes: {
        i18n: PropTypes.object.isRequired,
      },
    });
    // const html = wrapper.find('span').text();
    expect(wrapper.find('span').text()).to.be.equal(expectedValue);
  });
});

describe('TooltipWrapper', () => {
  it('simulates mouseenter events with tooltip', () => {
    const onMouseEnter = sinon.spy();
    const wrapper = mount((
      <TooltipWrapper onMouseEnter={onMouseEnter} tooltip='text'/>
    ));
    wrapper.find(TooltipWrapper).simulate('mouseEnter');
    expect(onMouseEnter.callCount).to.be.equal(1);
  });

  it('simulates mouseenter events without tooltip', () => {
    const onMouseEnter = sinon.spy();
    const wrapper = mount((
      <TooltipWrapper/>
    ));
    wrapper.find(TooltipWrapper).simulate('mouseEnter');
    expect(onMouseEnter.callCount).to.be.equal(0);
  });
});

describe('TooltipTime', () => {
  it('has innerHTML equal to "<span>5 months</span>" for equivalent timestamp (35929631)', () => {
    const inputValue = 35929631;
    const expectedValue = '<span>5 months</span>';
    const wrapper = mount(<TooltipTime label = {inputValue} />, {
      context: { i18n },
      childContextTypes: {
        i18n: PropTypes.object.isRequired,
      },
    });
    // const html = wrapper.find('span').text();
    expect(wrapper.find(Time).html()).to.be.equal(expectedValue);
  });
});
