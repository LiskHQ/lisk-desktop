import React from 'react';
import { expect } from 'chai';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import simulant from 'simulant';
import configureStore from 'redux-mock-store';
import CreateSecond from './index';
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
    // attachTo: document.body,
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

  it.skip('shows at least some progress on mousemove', () => {
    options.attachTo = document.body;
    const wrapper = mount(<CreateSecond {...props} agent='Chrome'/>, options);
    for (let i = 0; i < 100; i++) {
      simulant.fire(document.body, 'mousemove', {
        pageX: 100 * i, pageY: 100 * i,
      });
    }
    expect(wrapper.find('ProgressBar').props().value).to.be.at.least(1);
  });
});
