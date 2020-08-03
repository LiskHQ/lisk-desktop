import React from 'react';
import { mount } from 'enzyme';
import accounts from '../../../../test/constants/accounts';
import Send from './index';
import { mountWithRouter } from '../../../utils/testHelpers';

describe('Send', () => {
  let wrapper;

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
    initialValue: {},
  };

  beforeEach(() => {
    wrapper = mountWithRouter(Send, props);
  });

  it('should render properly getting data from URL', () => {
    expect(wrapper).toContainMatchingElement('Dialog');
    expect(wrapper).toContainMatchingElement('MultiStep');
    expect(wrapper).toContainMatchingElement('Form');
    expect(wrapper).not.toContainMatchingElement('Summary');
    expect(wrapper).not.toContainMatchingElement('TransactionStatus');
  });

  it('should render properly without getting data from URL', () => {
    const newProps = { ...props };
    newProps.history.location.path = '';
    newProps.history.location.search = '';
    wrapper = mountWithRouter(Send, newProps);
    wrapper.update();
    expect(wrapper).toContainMatchingElement('Dialog');
    expect(wrapper).toContainMatchingElement('MultiStep');
    expect(wrapper).toContainMatchingElement('Form');
  });
});
