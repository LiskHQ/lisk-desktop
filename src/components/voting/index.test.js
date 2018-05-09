import React from 'react';
import configureMockStore from 'redux-mock-store';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { spy } from 'sinon';
import { BrowserRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';
import i18n from '../../i18n';
import VotingHOC from './index';

describe('VotingHOC', () => {
  let wrapper;
  let store;

  beforeEach(() => {
    store = configureMockStore([])({
      peers: {},
      transactions: {
        pending: [],
        confirmed: [],
      },
      loading: [],
      voting: {
        delegates: [
          {
            username: 'username1',
            publicKey: 'sample_key',
            address: 'sample_address',
            rank: 12,
          },
        ],
        votes: {
          username1: { confirmed: true, unconfirmed: true, publicKey: 'sample_key' },
        },
      },
      account: {},
      delegate: {},
      search: {},
    });

    const history = {
      location: {
        pathname: '',
        search: '',
      },
      replace: spy(),
      createHref: () => {},
    };

    const options = {
      context: {
        store, history, i18n, router: { route: history, history },
      },
      childContextTypes: {
        i18n: PropTypes.object.isRequired,
        store: PropTypes.object.isRequired,
        router: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
      },
    };
    wrapper = mount(<Router>
      <VotingHOC history={history} store={store} />
    </Router>, options);
  });

  it('should render Voting', () => {
    expect(wrapper.find('Voting')).to.have.lengthOf(1);
  });
});
