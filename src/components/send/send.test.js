import React from 'react';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';

import MultiStep from '../multiStep';
import Send from './send';
import i18n from '../../i18n';

describe('Send', () => {
  let wrapper;
  let props;
  let options;

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

    props = {
      history: {
        replace: jest.fn(),
        location: {},
        push: jest.fn(),
      },
      account: {
        serverPublicKey: 'public_key',
        balance: 0,
      },
      i18n: { i18n },
    };

    options = {
      context: { i18n, store },
      childContextTypes: {
        i18n: PropTypes.object.isRequired,
        store: PropTypes.object.isRequired,
      },
    };

    wrapper = mount(<Send {...props} />, options);
  });

  it('should render MultiStep component ', () => {
    expect(wrapper.find(MultiStep)).toHaveLength(1);
  });

  it('go back to wallet after press Back button', () => {
    wrapper.find('.send-prev-button').at(0).simulate('click');
    wrapper.update();
    /* eslint-disable no-unused-expressions */
    expect(wrapper.instance().props.history.push).toHaveBeenCalledTimes(1);
  });

  it('go first to account initialization', () => {
    props.account = {
      serverPublicKey: '',
      balance: 1,
    };
    props.pendingTransactions = [];
    wrapper = mount(<Send {...props} />, options);
    expect(wrapper.find(MultiStep)).toHaveLength(1);
  });
});
