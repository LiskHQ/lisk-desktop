import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import thunk from 'redux-thunk';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import configureMockStore from 'redux-mock-store';
import * as accountActions from '../../actions/account';
import i18n from '../../i18n';
import RegisterDelegateHOC from './index';

describe('RegisterDelegateHOC', () => {
  let wrapper;
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
    username: 'lisk-hub',
  };

  const delegate = {};

  const store = configureMockStore([thunk])({
    peers,
    account,
    delegate,
  });

  beforeEach(() => {
    wrapper = mount(<Provider store={store}>
      <Router>
        <I18nextProvider i18n={ i18n }>
          <RegisterDelegateHOC />
        </I18nextProvider>
      </Router>
    </Provider>);
  });

  it('should render RegisterDelegate', () => {
    expect(wrapper.find('RegisterDelegate')).to.have.lengthOf(1);
  });

  it('should mount registerDelegate with appropriate properties', () => {
    const props = wrapper.find('RegisterDelegate').props();
    expect(props.peers).to.be.equal(peers);
    expect(props.account).to.be.equal(account);
    expect(props.delegate).to.be.equal(delegate);
    expect(typeof props.delegateRegistered).to.be.equal('function');
    expect(typeof props.delegatesFetched).to.be.equal('function');
    expect(typeof props.accountUpdated).to.be.equal('function');
  });

  it('should bind delegateRegistered action to RegisterDelegate props.delegateRegistered', () => {
    const actionsSpy = sinon.spy(accountActions, 'delegateRegistered');
    wrapper.find('RegisterDelegate').props().delegateRegistered({});
    expect(actionsSpy).to.be.calledWith();
    actionsSpy.restore();
  });
});
