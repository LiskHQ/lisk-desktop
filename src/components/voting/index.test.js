import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import Voting from './';
import store from '../../store';

describe('Voting', () => {
  let wrapper;

  beforeEach(() => {
    store.getState = () => ({
      peers: {},
      transactions: {
        pending: [],
        confirmed: [],
      },
      voting: {
        votedList: [],
        unvotedList: [],
      },
      account: {},
    });
    wrapper = mount(<Provider store={store}><Voting /></Provider>);
  });

  it('should render VotingComponent', () => {
    expect(wrapper.find('Voting')).to.have.lengthOf(1);
  });
});
