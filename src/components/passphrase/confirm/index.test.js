import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import ActionBar from '../../actionBar';
import Confirm from './index';
import i18n from '../../../i18n';
import accounts from '../../../../test/constants/accounts';


describe('Passphrase: Confirm', () => {
  let wrapper;
  const account = accounts.delegate;
  const props = {
    t: key => key,
    passphrase: account.passphrase,
    prevStep: () => {},
    finalCallback: () => {},
  };
  const fakeStore = configureStore();
  const store = fakeStore({
    account,
  });

  const options = {
    context: { i18n, store },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
      store: PropTypes.object.isRequired,
    },
  };

  beforeEach(() => {
    spy(props, 'prevStep');
    spy(props, 'finalCallback');
    wrapper = mount(<Confirm {...props} />, options);
  });

  afterEach(() => {
    props.prevStep.restore();
    props.finalCallback.restore();
  });

  it('renders an Input component', () => {
    expect(wrapper.find('Input')).to.have.lengthOf(1);
  });

  it('renders an ActionBar component', () => {
    expect(wrapper.find(ActionBar)).to.have.lengthOf(1);
  });

  it('should call prevStep if Cancel button clicked', () => {
    wrapper.find('button.cancel-button').simulate('click');
    expect(props.prevStep).to.have.been.calledWith();
  });

  it('should disable Next button if answer is not entered', () => {
    const wrapperProps = wrapper.find('button.next-button').props();
    expect(wrapperProps.disabled).to.be.equal(true);
  });

  it('should disable Next button if answer is incorrect', () => {
    wrapper.find('input').simulate('change', { target: { value: 'wrong' } });
    const wrapperProps = wrapper.find('button.next-button').props();
    expect(wrapperProps.disabled).to.be.equal(true);
  });

  it('should refocus if use blurs the input', () => {
    const focusSpy = spy();
    wrapper.find('input').simulate('blur', {
      nativeEvent: { target: { focus: focusSpy } },
    });

    expect(focusSpy.callCount).to.be.equal(1);
  });

  it('should enable Next button if answer is correct', () => {
    const wordsList = props.passphrase.split(' ');
    const missingWordIndex = wrapper.find('p.passphrase-holder span').at(0).text().split(' ').length;

    wrapper.find('input').simulate('change', { target: { value: wordsList[missingWordIndex - 1] } });
    const wrapperProps = wrapper.find('button.next-button').props();
    expect(wrapperProps.disabled).to.not.be.equal(true);
  });

  it('should call finalCallback if Next button clicked', () => {
    const wordsList = props.passphrase.split(' ');
    const missingWordIndex = wrapper.find('p.passphrase-holder span').at(0).text().split(' ').length;

    wrapper.find('input').simulate('change', { target: { value: wordsList[missingWordIndex - 1] } });
    wrapper.find('button.next-button').simulate('click');
    expect(props.finalCallback).to.have.been.calledWith(account.passphrase);
  });
});
