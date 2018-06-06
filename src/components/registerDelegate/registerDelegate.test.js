import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { Router } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import history from '../../history';
import i18n from '../../i18n';
import RegisterDelegate from './registerDelegate';

let store;

const account = {
  balance: 11000,
};
const delegate = {};
const browserHistory = {
  location: {
    pathname: '/regiser-delegate',
  },
  listen: () => {},
  goBack: spy(),
};

describe('RegisterDelegate', () => {
  let wrapper;

  const peers = { data: {} };
  store = configureMockStore([])({
    peers,
    account,
    delegate,
    activePeerSet: () => {},
  });

  const props = {
    account,
    delegate,
    closeDialog: () => {},
    history,
    t: key => key,
  };

  beforeEach(() => {
    wrapper = mount(<Provider store={store}>
        <Router history={browserHistory}>
          <I18nextProvider i18n={ i18n }>
            <RegisterDelegate {...props} />
          </I18nextProvider>
        </Router>
      </Provider>);
  });

  it('allows to go back to previous screen', () => {
    const backButton = wrapper.find('.multistep-back');
    backButton.first().simulate('click');
    expect(browserHistory.goBack).to.have.been.calledWith();
  });
});
