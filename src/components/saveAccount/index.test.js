import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import sinon from 'sinon';
import SaveAccountHOC from './index';
import * as savedAccounts from '../../actions/savedAccounts';


describe('SaveAccountHOC', () => {
  let wrapper;

  const account = {
    isDelegate: false,
    publicKey: 'sample_key',
    username: 'lisk-nano',
  };
  const peers = { data: {
    options: {
      address: 'http://localhost:4000',
      network: 'Custom node',
    },
  } };
  const store = configureMockStore([])({
    peers,
    account,
    activePeerSet: () => {},
  });

  beforeEach(() => {
    wrapper = mount(<Provider store={store}><SaveAccountHOC closeDialog={() => {}} /></Provider>);
  });

  it('should render SaveAccount', () => {
    expect(wrapper.find('SaveAccount')).to.have.lengthOf(1);
  });

  it('should bind accountSaved action to SaveAccount props.accountSaved', () => {
    const actionsSpy = sinon.spy(savedAccounts, 'accountSaved');
    wrapper.find('SaveAccount .save-account-button button').simulate('click');
    expect(actionsSpy).to.be.calledWith();
    actionsSpy.restore();
  });
});

