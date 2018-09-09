import React from 'react';
import { expect } from 'chai';
import { spy, useFakeTimers } from 'sinon';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import Confirm from './index';
import { PrimaryButton } from '../../toolbox/buttons/button';
import i18n from '../../../i18n';
import accounts from '../../../../test/constants/accounts';


describe('Passphrase: Confirm', () => {
  let wrapper;
  let clock;
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
    clock = useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date', 'setInterval'],
    });
  });

  afterEach(() => {
    props.prevStep.restore();
    props.finalCallback.restore();
    clock.restore();
  });

  it('renders an input component', () => {
    expect(wrapper.find('input')).to.have.lengthOf(6);
  });

  it('renders a PrimaryButton component', () => {
    expect(wrapper.find(PrimaryButton)).to.have.lengthOf(1);
  });

  it('should adjust styles depending on form state', () => {
    wrapper.find('fieldset').forEach((fieldset) => {
      fieldset.find('input').forEach((input) => {
        if (!account.passphrase.includes(input.props().value)) {
          input.simulate('change', { target: { checked: true } });
        }
      });
    });
    wrapper.update();
    let expectedClass = 'invalid';
    let className = wrapper.find('form').prop('className');
    expect(className).to.contain(expectedClass);

    wrapper.find('fieldset').forEach((fieldset) => {
      fieldset.find('input').forEach((input) => {
        if (account.passphrase.includes(input.props().value)) {
          input.simulate('change', { target: { checked: true } });
        }
      });
    });
    wrapper.update();
    expectedClass = 'valid';
    className = wrapper.find('form').prop('className');
    expect(className).to.contain(expectedClass);
  });

  it('should disable Next button if answer is incorrect', () => {
    // for each fieldset, checks the input if its value doesn't exist in passphrase
    wrapper.find('fieldset').forEach((fieldset) => {
      fieldset.find('input').forEach((input) => {
        if (account.passphrase.indexOf(input.props().value) < 0) {
          input.simulate('change', { target: { checked: true } });
        }
      });
    });
    wrapper.update();

    const wrapperProps = wrapper.find('button.get-to-your-dashboard-button').props();
    expect(wrapperProps.disabled).to.be.equal(true);
    wrapper.unmount();
  });

  it('should enable Next button if answer is correct', () => {
    // for each fieldset, checks the input if its value exist in passphrase
    wrapper.find('fieldset').forEach((fieldset) => {
      fieldset.find('input').forEach((input) => {
        if (account.passphrase.indexOf(input.props().value) > -1) {
          input.simulate('change', { target: { checked: true } });
        }
      });
    });
    clock.tick(1500);
    wrapper.update();

    const buttonWrapper = wrapper.find('button.get-to-your-dashboard-button');
    expect(buttonWrapper).to.not.have.prop('disabled', true);
  });
});
