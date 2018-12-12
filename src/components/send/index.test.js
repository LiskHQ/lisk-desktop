import React from 'react';
import { expect } from 'chai';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';

import MultiStep from '../multiStep';
import Send from './index';
import i18n from '../../i18n';

import styles from './send.css';

describe('Send', () => {
  let wrapper;

  beforeEach(() => {
    const store = configureMockStore([thunk])({
      peers: {
        data: {},
        options: {},
      },
      transactions: {},
      account: { serverPublicKey: 'public_key', balance: 0 },
      settings: {},
      settingsUpdated: () => {},
      liskService: {
        success: true,
        LSK: {
          USD: 1,
        },
      },
      followedAccounts: { accounts: [] },
    });

    wrapper = mount(<Provider store={store}>
      <Send
        history={ { location: {} } }
        account={{ serverPublicKey: 'public_key', balance: 0 }}
        i18n={i18n} />
    </Provider>);
  });

  it('should render MultiStep component ', () => {
    expect(wrapper.find(MultiStep)).to.have.lengthOf(1);
  });

  it('clicking send menu item should activate the send component', () => {
    wrapper.find('.send-menu-item').simulate('click');
    expect(wrapper.find('.send-box').first()).to.have.className(styles.isActive);
  });
});

