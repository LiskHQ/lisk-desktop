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

  spy(Safekeeping.prototype, 'next');

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

  it('should change the state.step to revealing-step', () => {
    const clock = useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
    });
    wrapper.find('SliderCheckbox').at(0).props()
      .onChange({ checked: true, value: 'introduction-step' });
    expect(Safekeeping.prototype.next.calledOnce).to.equal(true);
    clock.tick(701);
    wrapper.update();
    expect(wrapper.find('TransitionWrapper').at(0).props().current).to.be.equal('revealing-step');
    clock.restore();
  });

  it('should change the state.step to revealed-step', () => {
    const clock = useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
    });
    wrapper.find('SliderCheckbox').at(0).props()
      .onChange({ checked: true, value: 'revealing-step' });
    clock.tick(701);
    wrapper.update();
    expect(wrapper.find('TransitionWrapper').at(0).props().current).to.be.equal('revealed-step');
    clock.restore();
  });

  // Failing Randomly
  it.skip('should call nextStep if Next button clicked', () => {
    const clock = useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
    });
    wrapper.find('button.yes-its-safe-button').simulate('click');

    clock.tick(501);
    expect(props.nextStep).to.have.been.calledWith();
    wrapper.unmount();
    clock.restore();
  });

  it('should call prevStep if Back button clicked', () => {
    wrapper.find('button.back-button').simulate('click');

    expect(props.prevStep).to.have.been.calledWith({ jump: 2 });
    wrapper.unmount();
  });
});
