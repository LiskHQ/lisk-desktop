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
    history: {
      location: {
        search: '',
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
        search: '',
      },
    },
  };

  beforeEach(() => {
    wrapper = mount(<Send {...props} />, options);
  });

  it('should render properly', () => {
    expect(wrapper).toContainMatchingElement('.send-box');
    expect(wrapper).toContainMatchingElement('MultiStep');
    expect(wrapper).toContainMatchingElement('Form');
  });
});
