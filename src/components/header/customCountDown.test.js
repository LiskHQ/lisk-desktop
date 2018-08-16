import React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import { mount } from 'enzyme';
import CustomCountDown from './customCountDown';

describe('customCountDown', () => {
  let wrapper;

  beforeEach(() => {
    const propsMock = {
      minutes: 10,
      seconds: 25,
      autoLog: true,
      resetTimer: spy(),
      setActiveDialog: () => {},
      t: key => key,
      history: {
        replace: () => {},
      },
      closeDialog: () => {},
    };
    wrapper = mount(<CustomCountDown {...propsMock} />);
  });

  it('should render "Timeout in 10:25"', () => {
    expect(wrapper.find('span').text()).to.be.equal('Timeout in 10:25');
  });

  it('should render reset button', () => {
    wrapper.setProps({ minutes: 0, seconds: 59 });
    expect(wrapper.find('span').text()).to.be.equal('Timeout in 00:59');
    expect(wrapper).to.have.descendants('.reset');
  });

  it('should call resetTimer', () => {
    wrapper.setProps({ minutes: 0, seconds: 1 });
    expect(wrapper).to.have.descendants('.reset');
    expect(wrapper.props().resetTimer).to.not.be.calledWith();
    wrapper.find('.reset').simulate('click');
    wrapper.update();
    expect(wrapper.props().resetTimer).to.be.calledWith();
  });

  it('should render "Unlocked"', () => {
    wrapper.setProps({ autoLog: false });
    expect(wrapper.find('.unlocked').text()).to.be.equal('Unlocked');
  });
});
