import React from 'react';
import { expect } from 'chai';
import { spy, useFakeTimers } from 'sinon';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import ActionBar from '../../actionBar';
import Safekeeping from './index';
import i18n from '../../../i18n';
import accounts from '../../../../test/constants/accounts';


describe('Passphrase: Safekeeping', () => {
  let wrapper;
  const passphrase = 'stock wagon borrow episode laundry kitten salute link globe zero feed marble';
  const props = {
    passphrase,
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

  beforeEach(() => {
    spy(props, 'prevStep');
    spy(props, 'nextStep');
    wrapper = mount(<Safekeeping {...props} />, options);
  });

  afterEach(() => {
    props.prevStep.restore();
    props.nextStep.restore();
  });

  it('renders 2 SliderCheckbox components', () => {
    expect(wrapper.find('SliderCheckbox')).to.have.lengthOf(2);
  });

  it('renders a 12 .word elements to show the passphrase in', () => {
    expect(wrapper.find('.passphrase-wrapper span')).to.have.lengthOf(12);
  });

  it('renders an ActionBar component', () => {
    expect(wrapper.find(ActionBar)).to.have.lengthOf(1);
  });

  /**
   * @todo simulate doesn't trigger onChange
   */
  it.skip('should change the state to revealing if the first SliderCheckbox checked', () => {
    wrapper.find('SliderCheckbox').at(0).find('input[type="checkbox"]')
      .simulate('change', { target: { checked: true } });
    wrapper.update();

    const className = wrapper.find('section').at(0).props().className;
    expect(className).to.not.include('introduction-step');
    expect(className).to.include('revealing-step');
  });

  it('should call nextStep if Next button clicked', () => {
    const clock = useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
    });
    wrapper.find('button.yes-its-safe-button').simulate('click');

    clock.tick(501);
    expect(props.nextStep).to.have.been.calledWith();
    wrapper.unmount();
    clock.restore();
  });
});
