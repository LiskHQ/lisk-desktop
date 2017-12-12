import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';

import accounts from '../../../test/constants/accounts';
import ActionBar from '../actionBar';
import PassphraseShow from './passphraseShow';
import i18n from '../../i18n';


describe('PassphraseShow', () => {
  let wrapper;
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

  beforeEach(() => {
    spy(props, 'prevStep');
    spy(props, 'nextStep');
    wrapper = mount(<PassphraseShow {...props} />, options);
  });

  afterEach(() => {
    props.prevStep.restore();
    props.nextStep.restore();
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

  it('should call nextStep if Next button clicked', () => {
    wrapper.find('button.next-button').simulate('click');
    expect(props.nextStep).to.have.been.calledWith();
  });
});
