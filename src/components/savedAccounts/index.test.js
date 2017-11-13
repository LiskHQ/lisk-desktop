import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import sinon from 'sinon';
import PropTypes from 'prop-types';
import i18n from '../../i18n';
import SavedAccountsHOC from './index';
import * as savedAccounts from '../../actions/savedAccounts';

describe('SavedAccountsHOC', () => {
  let wrapper;

  const account = {
    isDelegate: false,
    publicKey: 'sample_key',
    username: 'lisk-nano',
  };
  const options = {
    address: 'http://localhost:4000',
    network: 'Custom node',
  };
  const peers = { data: { options }, options };
  const store = configureMockStore([])({
    peers,
    account,
    activePeerSet: () => {},
    savedAccounts: { accounts: [] },
  });

  beforeEach(() => {
    wrapper = mount(<SavedAccountsHOC closeDialog={() => {}} t={(key => key)} />, {
      context: { store, i18n },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
      },
    });
  });

  it('should render SavedAccounts', () => {
    expect(wrapper.find('SavedAccounts')).to.have.lengthOf(1);
  });

  it('should bind accountSaved action to SavedAccounts props.accountSaved', () => {
    const actionsSpy = sinon.spy(savedAccounts, 'accountSaved');
    wrapper.find('SavedAccounts').props().accountSaved({});
    expect(actionsSpy).to.be.calledWith();
    actionsSpy.restore();
  });

  it('should bind accountRemoved action to SavedAccounts props.accountRemoved', () => {
    const actionsSpy = sinon.spy(savedAccounts, 'accountRemoved');
    wrapper.find('SavedAccounts').props().accountRemoved({});
    expect(actionsSpy).to.be.calledWith();
    actionsSpy.restore();
  });

  it('should bind accountSwitched action to SavedAccounts props.accountSwitched', () => {
    const actionsSpy = sinon.spy(savedAccounts, 'accountSwitched');
    wrapper.find('SavedAccounts').props().accountSwitched({});
    expect(actionsSpy).to.be.calledWith();
    actionsSpy.restore();
  });
});

