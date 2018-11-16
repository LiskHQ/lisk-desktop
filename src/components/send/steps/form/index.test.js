import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import i18n from '../../../../i18n';
import FormHOC from './index';

describe('FormHOC', () => {
  let wrapper;
  const store = {};
  const peers = {
    data: {},
    status: true,
  };
  const account = {};
  const transactions = { pending: [] };

  const priceTicker = {
    success: true,
    LSK: {
      USD: 1,
    },
  };

  beforeEach(() => {
    store.getState = () => ({
      peers,
      account,
      transactions,
      settings: {},
      liskService: { priceTicker },
      followedAccounts: { accounts: [] },
    });
    store.subscribe = () => {};
    store.dispatch = () => {};
    wrapper = mount(<Router>
      <Provider store={store}>
        <FormHOC i18n={i18n} />
      </Provider>
    </Router>);
  });

  it('should render Send', () => {
    expect(wrapper.find('Form')).to.have.lengthOf(1);
  });
});
