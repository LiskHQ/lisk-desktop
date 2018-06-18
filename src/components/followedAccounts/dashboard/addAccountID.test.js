import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import configureStore from 'redux-mock-store';
import PropTypes from 'prop-types';
import i18n from '../../../i18n';
import AddAccountID from './addAccountID';

const fakeStore = configureStore();

describe('Add Account ID Component', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    const store = fakeStore({
      followedAccounts: { accounts: [{ address: '16313739661670634666L', balance: 0 }] },
    });

    props = {
      nextStep: spy(),
      prevStep: spy(),
      t: key => key,
    };

    wrapper = mount(<AddAccountID {...props} />, {
      context: { store, i18n },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
      },
    });
  });

  it('renders one Input components', () => {
    expect(wrapper.find('Input')).to.have.length(1);
  });

  it('renders two Button component', () => {
    expect(wrapper.find('Button')).to.have.length(2);
  });

  it('accepts valid address', () => {
    wrapper.find('.address input').simulate('change', { target: { value: '11004588490103196952L' } });
    expect(wrapper.find('Input.address').text()).to.not.contain('Invalid address');
  });

  it('recognizes empty field', () => {
    wrapper.find('.address input').simulate('change', { target: { value: '' } });
    expect(wrapper.find('Input.address').text()).to.contain('Required');
  });

  it('recognizes already following address', () => {
    wrapper.find('.address input').simulate('change', { target: { value: '16313739661670634666L' } });
    expect(wrapper.find('Input.address').text()).to.contain('ID already following');
  });

  it('recognizes invalid address', () => {
    wrapper.find('.address input').simulate('change', { target: { value: '11004588490103196952' } });
    expect(wrapper.find('Input.address').text()).to.contain('Invalid address');
  });

  it('cancels the process on button click', () => {
    wrapper.find('.cancel').first().simulate('click');
    expect(props.prevStep).to.have.been.calledWith();
  });

  it('goes to next step on button click', () => {
    wrapper.find('.address input').simulate('change', { target: { value: '11004588490103196952L' } });
    wrapper.find('.next').first().simulate('click');
    expect(props.nextStep).to.have.been.calledWith({ address: '11004588490103196952L' });
  });
});
