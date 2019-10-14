import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';

import store from '../../../../store';
import VotingListView from './index';

describe.skip('VotingListView', () => {
  let wrapper;
  const account = { address: '16313739661670634666L' };
  const voting = {
    votes: {},
    delegates: [],
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
      account,
      voting,
      transactions,
      delegate: {},
      loading: [],
    });
    wrapper = mount(<Provider store={store}>
      <VotingListView history={{ location: { search: '' } }} />
    </Provider>);
  });

  it('should render delegate list', () => {
    expect(wrapper.find(VotingListView)).to.have.lengthOf(1);
  });
});
