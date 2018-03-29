import React from 'react';
import { expect } from 'chai';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import { MemoryRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ConfirmationHOC from './index';
import ConfirmSecond from './confirmSecond';
import i18n from '../../../i18n';
import accounts from '../../../../test/constants/accounts';


describe('SecondPassphrase: ConfirmationHOC', () => {
  const account = accounts.delegate;
  const fakeStore = configureStore();
  const store = fakeStore({
    account,
  });
  let wrapper;

  const options = {
    context: { i18n, store },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
      store: PropTypes.object.isRequired,
    },
  };
  beforeEach(() => {
    wrapper = mount(<Router>
      <Provider store={store}>
        <ConfirmationHOC hidden={true} />
      </Provider>
    </Router>, options);
  });

  it('should contain ConfirmSecond', () => {
    expect(wrapper.find(ConfirmSecond)).to.have.lengthOf(1);
  });
});
