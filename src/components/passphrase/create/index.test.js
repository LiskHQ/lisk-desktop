import React from 'react';
import { expect } from 'chai';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import simulant from 'simulant';
import configureStore from 'redux-mock-store';
import Create from './index';
import i18n from '../../../i18n';
import accounts from '../../../../test/constants/accounts';


describe('Passphrase: Create', () => {
  const props = {
    t: key => key,
    prevStep: () => {},
    nextStep: () => {},
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
  });

  it.skip('shows at least some progress on mousemove', () => {
    const wrapper = mount(<Create {...props} agent='ipad'/>, options);
    for (let i = 0; i < 10; i++) {
      simulant.fire(document, 'mousemove', {
        pageX: 100 * i, pageY: 100 * i, relatedTarget: document.body,
      });
    }
    expect(wrapper.find('ProgressBar').props().value).to.be.at.least(1);
  });
});
