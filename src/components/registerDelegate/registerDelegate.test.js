import React from 'react';
import { expect } from 'chai';
// import { mount } from 'enzyme';
import { spy } from 'sinon';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';

import { mountWithContext } from './../../../test/utils/mountHelpers';
import i18n from '../../i18n'; // initialized i18next instance
import RegisterDelegateHOC from './index';

let store;

const history = {
  location: {
    pathname: '/dashboard',
  },
  goBack: spy(),
};
const props = {
  closeDialog: () => {},
  history,
  t: key => key,
};

describe('RegisterDelegate', () => {
  let wrapper;

  const peers = { data: {} };
  const account = {};
  const delegate = {};
  store = configureMockStore([])({
    peers,
    account,
    delegate,
    activePeerSet: () => {},
    history,
  });

  beforeEach(() => {
    const options = {
      context: { store, history, i18n },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
      },
    };

    wrapper = mountWithContext(<Provider store={store}>
      <Router>
        <I18nextProvider i18n={ i18n }>
          <RegisterDelegateHOC {...props} />
        </I18nextProvider>
      </Router>
    </Provider>, options);
  });

  // TODO: handle this in integration
  it.skip('allows to go back to previous screen', () => {
    const backButton = wrapper.find('.multistep-back');
    wrapper.setProps({ history });
    wrapper.update();
    backButton.first().simulate('click');
    expect(history.goBack).to.have.been.calledWith();
  });
});
