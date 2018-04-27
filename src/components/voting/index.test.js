import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import { BrowserRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';
import i18n from '../../i18n';
import VotingHOC from './';
import store from '../../store';

describe('VotingHOC', () => {
  let wrapper;

  beforeEach(() => {
    store.getState = () => ({
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
    });

    const history = {
      location: {
        pathname: '',
        search: '',
      },
      replace: spy(),
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

    wrapper = mount(<Router><VotingHOC history={history}/></Router>, options);
  });

  it('should render Voting', () => {
    expect(wrapper.find('Voting')).to.have.lengthOf(1);
  });
});
