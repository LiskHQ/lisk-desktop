import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import RegisterDelegate from './registerDelegate';
import RegisterDelegateConnected from './index';
import { accountUpdated } from '../../actions/account';
import actionTypes from '../../constants/actions';
import Alert from '../dialog/alert';

const fakeStore = configureStore();

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

  const store = fakeStore({
    account,
    peers,
  });

  const initialProps = {
    onAccountUpdated: () => (data) => {
      store.account = data;
      return accountUpdated(data);
    },
    showSuccessAlert: () => {},
    showErrorAlert: () => {},
  };

  beforeEach(() => {
    mountedAccount = mount(<RegisterDelegateConnected store={store} {...initialProps} />);
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

      expect(data).to.deep.equal({
        type: actionTypes.accountUpdated,
        data: account,
      });
    });
  });

  describe('showSuccessAlert', () => {
    it('should return a dispatch object', () => {
      const props = mountedAccount.find(RegisterDelegate).props();
      const data = props.showSuccessAlert({ text: 'sample text' });

      expect(data).to.deep.equal({
        type: actionTypes.dialogDisplayed,
        data: {
          title: 'Success',
          type: 'success',
          childComponent: Alert,
          childComponentProps: {
            text: 'sample text',
          },
        },
      });
    });
  });

  describe('showErrorAlert', () => {
    it('should return a dispatch object', () => {
      const props = mountedAccount.find(RegisterDelegate).props();
      const data = props.showErrorAlert({ text: 'sample text' });

      expect(data).to.deep.equal({
        type: actionTypes.dialogHidden,
        data: {
          title: 'Error',
          type: 'error',
          childComponent: Alert,
          childComponentProps: {
            text: 'sample text',
          },
        },
      });
    });
  });
});
