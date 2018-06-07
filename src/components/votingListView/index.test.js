import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';
import { BrowserRouter as Router } from 'react-router-dom';

import store from '../../store';
import VotingListView from './index';
import i18n from '../../i18n';
import history from '../../history';

describe.skip('VotingListView', () => {
  let wrapper;
  const account = { address: '16313739661670634666L' };
  const peers = { data: {} };
  const voting = {
    votes: {},
    delegates: [],
    totalDelegates: 10,
    refresh: false,
  };
  const confirmed = [];
  const pending = [];
  const transactions = {
    pending,
    confirmed,
    count: confirmed.length,
  };

  beforeEach(() => {
    store.getState = () => ({
      peers,
      account,
      voting,
      transactions,
      delegate: {},
      loading: [],
    });
    wrapper = mount(<Provider store={store}>
        <Router>
          <VotingListView history={{ location: { search: '' } }} />
        </Router>
      </Provider>, {
      context: { store, history, i18n },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
      },
    });
  });

  it('should render delegate list', () => {
    expect(wrapper.find(VotingListView)).to.have.lengthOf(1);
  });

  it('should mount DelegatesList with appropriate properties', () => {
    const props = wrapper.find('VotingListView').first().props();
    expect(props.refreshDelegates).to.be.equal(voting.refresh);
    expect(props.delegates).to.be.equal(voting.delegates);
    expect(props.votes).to.be.equal(voting.votes);
    expect(props.totalDelegates).to.be.equal(voting.totalDelegates);
    expect(props.activePeer).to.be.equal(peers.data);
    expect(props.address).to.be.equal(account.address);
    expect(typeof props.voteToggled).to.be.equal('function');
    expect(typeof props.votesFetched).to.be.equal('function');
    expect(typeof props.delegatesFetched).to.be.equal('function');
  });
});
