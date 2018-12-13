import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import i18n from '../../i18n';
import QuickTip from '.';

describe('QuickTip', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      t: key => key,
      i18n,
    };
    wrapper = mount(<QuickTip {...props} />);
  });

  it('should render QuickTip', () => {
    expect(wrapper).to.have.descendants('.quickTips');
  });

  it('should change pagination number after clicking nextStep', () => {
    wrapper.find('.nextStep').at(0).simulate('click');
    expect(wrapper.find('.pagination').at(0).text()).to.have.been.equal('2  /  4');
  });

  it('should change pagination number after clicking previousStep', () => {
    wrapper.find('.nextStep').at(0).simulate('click');
    expect(wrapper.find('.pagination').at(0).text()).to.have.been.equal('2  /  4');
    wrapper.find('.previousStep').at(0).simulate('click');
    expect(wrapper.find('.pagination').at(0).text()).to.have.been.equal('1  /  4');
  });

  it('should disable previousStep when last slide', () => {
    expect(wrapper.find('.pagination').at(0).text()).to.have.been.equal('1  /  4');
    expect(wrapper.find('.previousStep').at(0).hasClass('disabled')).to.equal(true);
  });

  it('should disable nextStep when last slide', () => {
    wrapper.find('.nextStep').at(0).simulate('click');
    wrapper.find('.nextStep').at(0).simulate('click');
    wrapper.find('.nextStep').at(0).simulate('click');
    expect(wrapper.find('.pagination').at(0).text()).to.have.been.equal('4  /  4');
    expect(wrapper.find('.nextStep').at(0).hasClass('disabled')).to.equal(true);
  });
});
