import React from 'react';
import { expect } from 'chai';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import CreateSecond from './create';
import i18n from '../../../i18n';
import accounts from '../../../../test/constants/accounts';


describe('Second Passphrase: Create', () => {
  const props = {
    t: key => key,
    prevStep: () => {},
    nextStep: () => {},
    addEventListener: () => {},
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

  it('shows ProgressBar components', () => {
    const wrapper = mount(<CreateSecond {...props} />, options);
    expect(wrapper.find('ProgressBar')).to.have.lengthOf(1);
  });

  it('should call showHint on Chrome', () => {
    sinon.spy(CreateSecond.prototype, 'next');
    const wrapper = mount(<CreateSecond {...props} agent='android' />, options);

    wrapper.find('button.next').props().onClick();
    expect(CreateSecond.prototype.next.calledOnce).to.equal(true);

    wrapper.find('button.next').simulate('click');
  });
});
