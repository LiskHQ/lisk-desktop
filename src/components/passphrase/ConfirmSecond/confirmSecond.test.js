import React from 'react';
import { expect } from 'chai';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import { spy, useFakeTimers } from 'sinon';
import configureStore from 'redux-mock-store';
import ConfirmSecond from './confirmSecond';
import i18n from '../../../i18n';
import accounts from '../../../../test/constants/accounts';


describe('SecondPassphrase: Confirmation', () => {
  const props = {
    t: key => key,
    hidden: false,
    finalCallback: spy(),
    account: accounts.delegate,
  };
  const account = accounts.delegate;
  const fakeStore = configureStore();
  const store = fakeStore({
    account,
  });
  let wrapper;
  let clock;

  const options = {
    context: { i18n, store },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
      store: PropTypes.object.isRequired,
    },
  };
  beforeEach(() => {
    clock = useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date', 'setInterval'],
    });
  });

  afterEach(() => {
    clock.restore();
  });

  it('should hide the component when hidden is equal to true', () => {
    wrapper = mount(<ConfirmSecond {...props} hidden={true} />, options);
    const className = wrapper.find('section').props().className;
    expect(className).to.include('hidden');
  });

  it('shows login step when user is not login', () => {
    wrapper = mount(<ConfirmSecond {...props} account={{ passphrase: null }} />, options);
    clock.tick(501);
    wrapper.update();
    const className = wrapper.find('h2').at(0).props().className;
    expect(className).to.include('slideIn');
  });

  it('should unlock button become enable when passphrase is entered', () => {
    const newAccount = Object.assign({}, accounts.delegate, { passphrase: null });
    wrapper = mount(<ConfirmSecond {...props} account={newAccount} />, options);
    clock.tick(501);
    wrapper.update();
    expect(wrapper.find('button.unlock')).to.be.disabled();
    const temp = wrapper.find('Input.passphraseInput input').at(0);
    temp.simulate('change', { target: { value: accounts.delegate.passphrase } });
    wrapper.update();
    expect(wrapper.find('button.unlock')).to.not.be.disabled();
    wrapper.find('button.unlock').simulate('click');
    clock.tick(501);
    wrapper.update();
    const className = wrapper.find('h2').at(1).props().className;
    expect(className).to.include('slideIn');
  });

  it('shows confirmation step when user is login', () => {
    wrapper = mount(<ConfirmSecond {...props} />, options);
    clock.tick(501);
    wrapper.update();
    const className = wrapper.find('h2').at(1).props().className;
    expect(className).to.include('slideIn');
  });

  it('should show pending mode when SliderCheckbox is checked', () => {
    wrapper = mount(<ConfirmSecond {...props} />, options);
    wrapper.find('SliderCheckbox').at(0).find('input[type="checkbox"]')
      .simulate('change', { target: { checked: true } });
    clock.tick(501);
    wrapper.update();
    const className = wrapper.find('#pendingContainer').props().className;
    expect(className).to.include('slideIn');
    expect(props.finalCallback).to.have.been.calledWith();
  });

  it('should show the final Step when secondSecret is set', () => {
    wrapper = mount(<ConfirmSecond {...props} />, options);
    wrapper.find('SliderCheckbox').at(0).find('input[type="checkbox"]')
      .simulate('change', { target: { checked: true } });
    clock.tick(501);
    wrapper.update();
    expect(props.finalCallback).to.have.been.calledWith();
    wrapper.setProps({
      account: {
        passphrase: accounts.passphrase,
        secondSignature: 1,
      },
    });
    clock.tick(501);
    wrapper.update();
    const className = wrapper.find('.doneContainer').props().className;
    expect(className).to.include('slideIn');
  });
});
