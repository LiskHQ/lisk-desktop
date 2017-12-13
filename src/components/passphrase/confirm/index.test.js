import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import Confirm from './index';
import { PrimaryButton } from '../../toolbox/buttons/button';
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

  it('renders an input component', () => {
    expect(wrapper.find('input')).to.have.lengthOf(6);
  });

  it('renders a PrimaryButton component', () => {
    expect(wrapper.find(PrimaryButton)).to.have.lengthOf(1);
  });

  /**
   * @todo change simulation doesn't work
   */
  it.skip('should disable Next button if answer is incorrect', () => {
    // for each fieldset, checks the input if its value doesn't exist in passphrase
    wrapper.find('fieldset').forEach((fieldset) => {
      fieldset.find('input').forEach((input) => {
        if (account.passphrase.indexOf(input.props().value) < 0) {
          input.simulate('change', { target: { checked: true } });
        }
      });
    });
    wrapper.update();

    const wrapperProps = wrapper.find('button.next-button').props();
    expect(wrapperProps.disabled).to.be.equal(true);
  });

  /**
   * @todo change simulation doesn't work
   */
  it.skip('should enable Next button if answer is correct', () => {
    // for each fieldset, checks the input if its value exist in passphrase
    wrapper.find('fieldset').forEach((fieldset) => {
      fieldset.find('input').forEach((input) => {
        if (account.passphrase.indexOf(input.props().value) > 0) {
          input.simulate('change', { target: { checked: true } });
        }
      });
    });
    wrapper.update();

    const wrapperProps = wrapper.find('button.next-button').props();
    expect(wrapperProps.disabled).to.not.be.equal(true);
  });
});
