import React from 'react';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import accounts from '../../../../../test/constants/accounts';
import i18n from '../../../../i18n';
import Send from './send';

jest.mock('../../i18n', () => ({
  t: v => v,
  language: 'en',
}));

describe('Send', () => {
  let wrapper;

  const store = configureMockStore([thunk])({
    settings: { currency: 'USD', token: { active: 'LSK' } },
    settingsUpdated: () => {},
    network: {
      status: { online: true },
      name: 'Custom Node',
      networks: {
        LSK: {
          nodeUrl: 'hhtp://localhost:4000',
          nethash: '2349jih34',
        },
      },
    },
    liskService: {
      success: true,
      LSK: {
        USD: 1,
      },
    },
    prevState: {
      fields: {},
    },
    fields: {},
    history: {
      location: {
        path: '/wallet/send/send',
        search: '?recipient=16313739661670634666L&amount=10&reference=test',
      },
      push: jest.fn(),
    },
    transactions: {
      failed: undefined,
      pending: [],
      transactionsCreated: [],
      transactionsCreatedFailed: [],
      broadcastedTransactionsError: [],
    },
    failedTransactions: '',
    account: {
      balance: accounts.genesis.balance,
      info: {
        LSK: accounts.genesis,
      },
    },
    bookmarks: {
      LSK: [
        {
          title: 'ABC',
          address: '12345L',
          balance: 10,
        },
        {
          title: 'FRG',
          address: '12375L',
          balance: 15,
        },
        {
          title: 'KTG',
          address: '12395L',
          balance: 7,
        },
      ],
    },
    search: {
      delegates: {},
      accounts: {},
    },
    service: {
      dynamicFees: {},
    },
  });

  const options = {
    context: { i18n, store },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
      store: PropTypes.object.isRequired,
    },
  };

  const props = {
    settings: { currency: 'USD' },
    settingsUpdated: () => {},
    liskService: {
      success: true,
      LSK: {
        USD: 1,
      },
    },
    account: {
      balance: accounts.genesis.balance,
    },
    t: v => v,
    prevState: {
      fields: {},
    },
    bookmarks: {
      LSK: [{
        title: 'ABC',
        address: '12345L',
        balance: 10,
      },
      {
        title: 'FRG',
        address: '12375L',
        balance: 15,
      },
      {
        title: 'KTG',
        address: '12395L',
        balance: 7,
      }],
    },
    history: {
      location: {
        path: '/wallet/send/send',
        search: '?recipient=16313739661670634666L&amount=10&reference=test',
      },
      push: jest.fn(),
    },
  };

  beforeEach(() => {
    wrapper = mount(<Send {...props} />, options);
  });

  it('should render properly getting data from URL', () => {
    expect(wrapper).toContainMatchingElement('.send-box');
    expect(wrapper).toContainMatchingElement('MultiStep');
    expect(wrapper).toContainMatchingElement('Form');
    expect(wrapper).not.toContainMatchingElement('Summary');
    expect(wrapper).not.toContainMatchingElement('TransactionStatus');
  });

  it('should render properly without getting data from URL', () => {
    const newProps = { ...props };
    newProps.history.location.path = '';
    newProps.history.location.search = '';
    wrapper = mount(<Send {...newProps} />, options);
    wrapper.update();
    expect(wrapper).toContainMatchingElement('.send-box');
    expect(wrapper).toContainMatchingElement('MultiStep');
    expect(wrapper).toContainMatchingElement('Form');
  });
});
