import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import ActionBar from '../../actionBar';
import Info from './index';
import i18n from '../../../i18n';
import accounts from '../../../../test/constants/accounts';


describe('Passphrase: Info', () => {
  let wrapper;
  const props = {
    t: key => key,
    nextStep: () => {},
    backButtonFn: () => {},
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
    spy(props, 'nextStep');
    spy(props, 'backButtonFn');
    wrapper = mount(<Info {...props} />, options);
  });

  afterEach(() => {
    props.nextStep.restore();
    props.backButtonFn.restore();
  });

  it('renders an InfoParagraph component', () => {
    expect(wrapper.find('InfoParagraph')).to.have.lengthOf(1);
  });

  it('renders an ActionBar component', () => {
    expect(wrapper.find(ActionBar)).to.have.lengthOf(1);
  });

  it('should call backButtonFn if Cancel button clicked', () => {
    wrapper.find('button.cancel-button').simulate('click');
    expect(props.backButtonFn).to.have.been.calledWith();
  });

  it('should call nextStep if Next button clicked', () => {
    wrapper.find('button.next-button').simulate('click');
    expect(props.nextStep).to.have.been.calledWith();
  });
});
