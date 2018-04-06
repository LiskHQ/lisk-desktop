import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import CountDownTemplate from './countDownTemplate';

describe('countDownTemplate', () => {
  let wrapper;

  beforeEach(() => {
    const propsMock = {
      minutes: 10,
      seconds: 25,
    };
    wrapper = mount(<CountDownTemplate {...propsMock} />);
  });

  it('should render "10:25"', () => {
    expect(wrapper.find('span').text()).to.be.equal('10:25');
  });

  it('should render "01:05"', () => {
    wrapper.setProps({ minutes: 1, seconds: 5 });
    expect(wrapper.find('span').text()).to.be.equal('01:05');
  });
});
