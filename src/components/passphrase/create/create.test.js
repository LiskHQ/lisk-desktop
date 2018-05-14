import React from 'react';
import { expect } from 'chai';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import Create from './create';
import i18n from '../../../i18n';
import accounts from '../../../../test/constants/accounts';


describe('Passphrase: Create', () => {
  const props = {
    t: key => key,
    step: 'generate',
    addEventListener: () => {},
    prevStep: () => {},
    nextStep: () => {},
    percentage: 0,
  };
  const account = accounts.delegate;
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

  it('shows multiple MovableShape components', () => {
    const wrapper = mount(<Create {...props} />, options);
    expect(wrapper.find('MovableShape')).to.have.lengthOf(9);
  });

  it('should render no PrimaryButton initially', () => {
    const wrapper = mount(<Create {...props} />, options);
    expect(wrapper.find('PrimaryButton')).to.have.lengthOf(0);
  });

  it('should call showHint on ANDROID', () => {
    const wrapper = mount(<Create {...props} agent='android' />, options);
    wrapper.find('aside Button').simulate('click');
    expect(wrapper.state().showHint).to.be.equal(true);
    wrapper.unmount();
  });

  it('should call showHint on Taizen', () => {
    const wrapper = mount(<Create {...props} agent='teizen' />, options);
    wrapper.find('aside Button').simulate('click');
    expect(wrapper.state().showHint).to.be.equal(true);
  });
});
