import React from 'react';
import { expect } from 'chai';
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
        location: {},
      },
      account: {
        serverPublicKey: 'public_key',
        balance: 0,
      },
      i18n: { i18n },
    };

    const options = {
      context: { i18n, store },
      childContextTypes: {
        i18n: PropTypes.object.isRequired,
        store: PropTypes.object.isRequired,
      },
    };

    wrapper = mount(<Send {...props} />, options);
  });

  it('should render MultiStep component ', () => {
    expect(wrapper.find(MultiStep)).to.have.lengthOf(1);
  });
});
