import React from 'react';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
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
    },
  };

  beforeEach(() => {
    wrapper = mount(<Send {...props} />, options);
  });

  it('should render properly getting data from URL', () => {
    expect(wrapper).toContainMatchingElement('.send-box');
    expect(wrapper).toContainMatchingElement('MultiStep');
    expect(wrapper).toContainMatchingElement('Form');
  });

  it('should render properly without getting data from URL', () => {
    props.history.location.path = '';
    props.history.location.search = '';
    wrapper = mount(<Send {...props} />, options);
    wrapper.update();
    expect(wrapper).toContainMatchingElement('.send-box');
    expect(wrapper).toContainMatchingElement('MultiStep');
    expect(wrapper).toContainMatchingElement('Form');
  });
});
