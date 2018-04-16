import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter as Router } from 'react-router-dom';
import i18n from '../../i18n'; // initialized i18next instance
import RegisterDelegateHOC from './index';
import { prepareStore } from '../../../test/utils/applicationInit';
import { accountLoggedIn } from '../../actions/account';
import * as delegateApi from '../../utils/api/delegate';
import delegateReducer from '../../store/reducers/delegate';
import accountReducer from '../../store/reducers/account';
import peersReducer from '../../store/reducers/peers';
import networks from '../../constants/networks';
import loginMiddleware from '../../store/middlewares/login';

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

let clock;
let store;

const props = {
  closeDialog: () => {},
  delegateRegistered: sinon.spy(),
  t: key => key,
};

// const normalProps = { ...props, account: normalAccount };
const withSecondSecretProps = { ...props, account: withSecondSecretAccount };

/* eslint-disable mocha/no-exclusive-tests */
describe.only('RegisterDelegate', () => {
  let wrapper;
  let delegateApiMock;

  describe('Ordinary account', () => {
    beforeEach(() => {
      store = prepareStore({
        peers: peersReducer,
        account: accountReducer,
        delegate: delegateReducer,
      }, [
        thunk,
        loginMiddleware,
      ]);
      // store.dispatch = () => {};
      // store.subscribe = () => {};
      wrapper = mount(<Provider store={store}>
        <Router>
          <I18nextProvider i18n={ i18n }>
            <RegisterDelegateHOC />
          </I18nextProvider>
        </Router>
      </Provider>);
      delegateApiMock = sinon.mock(delegateApi);
      clock = sinon.useFakeTimers({
        toFake: ['setTimeout', 'clearTimeout', 'Date', 'setInterval'],
      });
    });

    afterEach(() => {
      clock.restore();
      delegateApiMock.restore();
    });

    it('renders a MultiStep component', () => {
      expect(wrapper.find('MultiStep')).to.have.length(1);
    });

    it('renders one Choose component', () => {
      expect(wrapper.find('Choose')).to.have.length(1);
    });

    it.only('allows register as delegate for a non delegate account', () => {
      store.dispatch(accountLoggedIn(normalAccount));
      wrapper.find('.choose-name').first().simulate('click');
      wrapper.find('.delegate-name').first().find('input')
        .simulate('change', { target: { value: 'sample_username' } });
      const submitDelegateBtn = wrapper.find('.submit-delegate-name').first();
      expect(submitDelegateBtn.props().disabled).to.not.equal(true);
      submitDelegateBtn.simulate('click');
      clock.tick(300);
      wrapper.find('.confirm-delegate-registration').find('input').first()
        .simulate('change');

      const expectedRegisterCallArgs = {
        activePeer: peers.data,
        account: normalAccount,
        username: 'sample_username',
        passphrase: normalAccount.passphrase,
        secondPassphrase: null,
      };
      console.log(wrapper.debug());
      expect(props.delegateRegistered).to.have.been.calledWith(expectedRegisterCallArgs);
    });

    it('handles register as delegate "Name already taken!" error', () => {
      wrapper.find('.choose-name').first().simulate('click');
      const delegateNameInput = wrapper.find('.delegate-name').first().find('input');
      delegateApiMock.expects('getDelegate').returnsPromise().rejects({});
      delegateNameInput.simulate('change', { target: { value: 'genesis_17' } });
      clock.tick(250);
      wrapper.update();
      const message = 'Name is already taken!';
      expect(wrapper.find('.error-name-duplicate').first()).to.have.text(message);
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
            <RegisterDelegateHOC {...withSecondSecretProps} />
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
            <RegisterDelegateHOC />
          </I18nextProvider>
        </Router>
      </Provider>);
    });

    it('should disable confirm register as delegate', () => {
      expect(wrapper.find('InfoParagraph')).to.have.length(1);
    });
  });
});
/* eslint-enable mocha/no-exclusive-tests */
