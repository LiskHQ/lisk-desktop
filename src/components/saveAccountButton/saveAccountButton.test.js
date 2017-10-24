import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';
import { BrowserRouter as Router } from 'react-router-dom';
import SaveAccountButton from './saveAccountButton';

describe('SaveAccountButton', () => {
  const account = { publicKey: 'sampleKey' };
  const emptySavedAccounts = [];
  const savedAccounts = [account];
  const props = {
    theme: {
      menuLink: 'some class',
      menuItem: 'some other class',
    },
    account,
    accountRemoved: sinon.spy(),
    t: key => key,
  };


  const store = configureMockStore([])({
    account,
    activePeerSet: () => {},
  });
  const options = {
    context: { store },
    childContextTypes: {
      store: PropTypes.object.isRequired,
    },
  };

  it('fires accountRemoved action if an account is already saved', () => {
    const wrapper = mount(<Router>
      <SaveAccountButton {...props} savedAccounts={savedAccounts} /></Router>, options);
    wrapper.find('MenuItem').simulate('click');
    expect(props.accountRemoved).to.have.been.calledWith();
  });

  it('Allows to open SaveAccount modal if account not yet saved', () => {
    const wrapper = mount(<Router>
      <SaveAccountButton {...props} savedAccounts={emptySavedAccounts} /></Router>, options);
    expect(wrapper.find('RelativeLink').exists()).to.equal(true);
  });
});
