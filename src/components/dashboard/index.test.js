import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import PropTypes from 'prop-types';
import i18n from '../../i18n';
import Dashboard from './index';
import TransactionRow from '../transactions/transactionRow';

describe('Dashboard', () => {
  let wrapper;
  let transactions;
  let peers;
  let store;
  let history;
  let options;

  beforeEach(() => {
    transactions = {
      pending: [],
      confirmed: [
        {
          id: '1038520263604146911',
        }, {
          id: '2038520263604146911',
        }, {
          id: '3038520263604146911',
        }, {
          id: '4038520263604146911',
        },
      ],
    };
    peers = {
      data: {},
      options: {},
    };
    store = configureMockStore([])({
      peers,
      transactions,
    });
    history = {
      location: {
        pathname: '',
        search: '',
      },
      replace: spy(),
      createHref: spy(),
      push: spy(),
    };

    options = {
      context: {
        store, history, i18n, router: { route: history, history },
      },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
        router: PropTypes.object.isRequired,
      },
      lifecycleExperimental: true,
    };
    wrapper = mount(<Dashboard/>, options);
  });

  it('should render transaction list with at most 3 transactions', () => {
    expect(wrapper.find(TransactionRow)).to.have.lengthOf(3);
  });
});
