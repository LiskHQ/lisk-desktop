import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import Lisk from 'lisk-js';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n'; // initialized i18next instance
import store from '../../store';
import RegisterDelegate from './registerDelegate';
import * as delegateApi from '../../utils/api/delegate';


const normalAccount = {
  passphrase: 'pass',
  isDelegate: false,
  address: '16313739661670634666L',
  balance: 1000e8,
};

const delegateAccount = {
  passphrase: 'pass',
  isDelegate: true,
  address: '16313739661670634666L',
  balance: 1000e8,
  delegate: {
    username: 'lisk-nano',
  },
};

const withSecondSecretAccount = {
  passphrase: 'pass',
  address: '16313739661670634666L',
  balance: 1000e8,
  delegate: {
    username: 'lisk-nano',
  },
  secondSignature: 1,
};

const props = {
  peers: {
    data: Lisk.api({
      name: 'Custom Node',
      custom: true,
      address: 'http://localhost:4000',
      testnet: true,
      nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
    }),
  },
  closeDialog: () => {},
  delegateRegistered: sinon.spy(),
  t: key => key,
};

const delegateProps = { ...props, account: delegateAccount };
const normalProps = { ...props, account: normalAccount };
const withSecondSecretProps = { ...props, account: withSecondSecretAccount };

describe('RegisterDelegate', () => {
  let wrapper;
  let delegateApiMock;

  beforeEach(() => {
    delegateApiMock = sinon.mock(delegateApi);
  });

  afterEach(() => {
    delegateApiMock.verify();
    delegateApiMock.restore();
  });

  describe('Ordinary account', () => {
    beforeEach(() => {
      store.getState = () => ({
        account: normalAccount,
      });
      wrapper = mount(<Provider store={store}>
        <I18nextProvider i18n={ i18n }>
          <RegisterDelegate {...normalProps} />
        </I18nextProvider>
      </Provider>);
    });

    it('renders an InfoParagraph components', () => {
      expect(wrapper.find('InfoParagraph')).to.have.length(1);
    });

    it('renders one Input component for a normal account', () => {
      expect(wrapper.find('Input')).to.have.length(1);
    });

    it('allows register as delegate for a non delegate account', () => {
      wrapper.find('.username input').simulate('change', { target: { value: 'sample_username' } });
      wrapper.find('button.next-button').simulate('submit');
      expect(wrapper.find('.primary-button button').props().disabled).to.not.equal(true);
      expect(props.delegateRegistered).to.have.been.calledWith();
    });

    it.skip('handles register as delegate "username already exists" failure', () => {
      const message = 'Username already exists';
      delegateApiMock.expects('registerDelegate').rejects({ message });
      wrapper.find('.username input').simulate('change', { target: { value: 'sample_username' } });
      wrapper.find('.next-button').simulate('click');
      // TODO: this doesn't work for some reason
      // expect(wrapper.find('RegisterDelegate .username').text()).to.contain(message);
    });

    it.skip('handles register as delegate failure', () => {
      delegateApiMock.expects('registerDelegate').rejects({ success: false });
      wrapper.find('.username input').simulate('change', { target: { value: 'sample_username' } });
      wrapper.find('.next-button').simulate('click');
      expect(wrapper.find('.primary-button button').props().disabled).to.not.equal(true);
      // TODO: this doesn't work for some reason
      // expect(props.showErrorAlert).to.have.been.calledWith();
    });
  });

  describe('Ordinary account with second secret', () => {
    beforeEach(() => {
      store.getState = () => ({
        account: withSecondSecretAccount,
      });
      wrapper = mount(<Provider store={store}>
        <I18nextProvider i18n={ i18n }>
          <RegisterDelegate {...withSecondSecretProps} />
        </I18nextProvider>
      </Provider>);
    });

    it('renders two Input component for a an account with second secret', () => {
      expect(wrapper.find('Input')).to.have.length(2);
    });

    it('allows register as delegate for a non delegate account with second secret', () => {
      wrapper.find('.username input').simulate('change', { target: { value: 'sample_username' } });
      wrapper.find('.second-passphrase input').simulate('change', { target: { value: 'sample phrase' } });
      expect(props.delegateRegistered).to.have.been.calledWith();
    });
  });

  describe('Delegate account', () => {
    beforeEach(() => {
      store.getState = () => ({
        account: delegateAccount,
      });
      wrapper = mount(<Provider store={store}>
        <I18nextProvider i18n={ i18n }>
          <RegisterDelegate {...delegateProps} />
        </I18nextProvider>
      </Provider>);
    });

    it('renders an InfoParagraph component', () => {
      expect(wrapper.find('InfoParagraph')).to.have.length(1);
    });

    it('does not render the delegate registration form for registering', () => {
      expect(wrapper.find('form')).to.have.length(0);
    });
  });
});
