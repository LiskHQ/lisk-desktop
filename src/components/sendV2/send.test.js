import React from 'react';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import accounts from '../../../test/constants/accounts';
import i18n from '../../i18n';
import Send from './send';

describe('Form', () => {
  let wrapper;

  const store = configureMockStore([thunk])({
    settings: { currency: 'USD' },
    settingsUpdated: () => {},
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
        path: '/wallet/sendV2/send',
        search: '?recipient=16313739661670634666L&amount=10&reference=test',
      },
      push: jest.fn(),
    },
    transactions: {
      failed: undefined,
    },
    account: {
      balance: accounts.genesis.balance,
    },
    followedAccounts: {
      accounts: [
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
    fields: {},
    followedAccounts: [
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
    history: {
      location: {
        path: '/wallet/sendV2/send',
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

  it('should call finallCallback after submit a transaction', () => {
    wrapper.find('input.recipient').simulate('change', { target: { name: 'recipient', value: '12345L' } });
    const amountField = wrapper.find('.fieldGroup').at(1);
    amountField.find('InputV2').simulate('change', { target: { name: 'amount', value: '.1' } });
    jest.advanceTimersByTime(300);
    wrapper.update();
    wrapper.find('.btn-submit').at(0).simulate('click');
    wrapper.update();
    expect(wrapper).toContainMatchingElement('Summary');
    wrapper.find('.on-nextStep').at(0).simulate('click');
    wrapper.update();
    expect(wrapper).toContainMatchingElement('TransactionStatus');
    wrapper.find('.on-goToWallet').at(0).simulate('click');
    wrapper.update();
    expect(props.history.push).toBeCalled();
  });
});
