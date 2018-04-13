import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter as Router } from 'react-router-dom';
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
    username: 'lisk-hub',
  },
};

const withSecondSecretAccount = {
  passphrase: 'pass',
  address: '16313739661670634666L',
  balance: 1000e8,
  delegate: {
    username: 'lisk-hub',
  },
  secondSignature: 1,
};

const delegateStore = {};
const clock = sinon.useFakeTimers({
  toFake: ['setTimeout', 'clearTimeout', 'Date', 'setInterval'],
});

const props = {
  peers: {
    data: {},
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
        delegate: delegateStore,
      });
      wrapper = mount(<Provider store={store}>
        <Router>
          <I18nextProvider i18n={ i18n }>
            <RegisterDelegate {...normalProps} />
          </I18nextProvider>
        </Router>
      </Provider>);
    });

    it('renders a MultiStep component', () => {
      expect(wrapper.find('MultiStep')).to.have.length(1);
    });

    it('renders one Choose component', () => {
      expect(wrapper.find('Choose')).to.have.length(1);
    });

    it.skip('allows register as delegate for a non delegate account', () => {
      wrapper.find('.choose-name').first().simulate('click');
      wrapper.find('.delegate-name').first().find('input').simulate('change', { target: { value: 'sample_username' } });
      clock.tick(300);
      const submitDelegateBtn = wrapper.find('.submit-delegate-name').first();
      expect(submitDelegateBtn.props().disabled).to.not.equal(true);
      submitDelegateBtn.simulate('click');
      wrapper.find('.confirm-delegate-registration').first().simulate('change');
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

  describe.skip('Ordinary account with second secret', () => {
    beforeEach(() => {
      store.getState = () => ({
        account: withSecondSecretAccount,
      });
      wrapper = mount(<Provider store={store}>
        <Router>
          <I18nextProvider i18n={ i18n }>
            <RegisterDelegate {...withSecondSecretProps} />
          </I18nextProvider>
        </Router>
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

  describe.skip('Delegate account', () => {
    beforeEach(() => {
      store.getState = () => ({
        account: delegateAccount,
      });
      wrapper = mount(<Provider store={store}>
        <Router>
          <I18nextProvider i18n={ i18n }>
            <RegisterDelegate {...delegateProps} />
          </I18nextProvider>
        </Router>
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
