import React from 'react';
import PropTypes from 'prop-types';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import RegisterDelegate from './registerDelegate';
import RegisterDelegateConnected from './index';
import { accountUpdated } from '../../actions/account';

describe('RegisterDelegateConnected', () => {
  let mountedAccount;
  // Mocking store
  const peers = {
    status: {
      online: false,
    },
    data: {
      currentPeer: 'localhost',
      port: 4000,
      options: {
        name: 'Custom Node',
      },
    },
  };

  const account = {
    isDelegate: false,
    address: '16313739661670634666L',
    username: 'lisk-nano',
  };

  const store = {
    dispatch: () => {},
    subscribe: () => {},
    getState: () => ({
      peers,
      account,
    }),
    onAccountUpdated: () => (data) => {
      store.account = data;
      return accountUpdated(data);
    },
    showSuccessAlert: () => {},
    showErrorAlert: () => {},
  };
  const options = {
    context: { store },
    childContextTypes: { store: PropTypes.object.isRequired },
  };

  beforeEach(() => {
    mountedAccount = mount(<Router><RegisterDelegateConnected/></Router>, options);
  });

  it('should mount registerDelegate with appropriate properties', () => {
    const props = mountedAccount.find(RegisterDelegate).props();
    expect(props.peers).to.be.equal(peers);
    expect(props.account).to.be.equal(account);
    expect(typeof props.onAccountUpdated).to.be.equal('function');
    expect(typeof props.showSuccessAlert).to.be.equal('function');
    expect(typeof props.showErrorAlert).to.be.equal('function');
  });

  describe('onAccountUpdated', () => {
    it('should return a dispatch object', () => {
      const props = mountedAccount.find(RegisterDelegate).props();
      const data = props.onAccountUpdated(account);
      expect(data).to.be.equal();
    });
  });

  describe('showSuccessAlert', () => {
    it('should return a dispatch object', () => {
      const props = mountedAccount.find(RegisterDelegate).props();
      const data = props.showSuccessAlert('sample text');
      expect(data).to.be.equal();
    });
  });

  describe('showErrorAlert', () => {
    it('should return a dispatch object', () => {
      const props = mountedAccount.find(RegisterDelegate).props();
      const data = props.showErrorAlert('sample text');
      expect(data).to.be.equal();
    });
  });
});
