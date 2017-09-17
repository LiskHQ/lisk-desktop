import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import sinon from 'sinon';
import Voting from './voting';
import store from '../../store';

describe('Voting', () => {
  let wrapper;

  const delegates = [
    {
      address: 'address 1',
      username: 'username1',
      publicKey: 'sample_key',
    },
    {
      address: 'address 2',
      username: 'username2',
      publicKey: 'sample_key',
    },
  ];
  const votes = {
    username1: { confirmed: true, unconfirmed: true, publicKey: 'sample_key' },
  };
  const props = {
    refreshDelegates: false,
    delegates,
    totalDelegates: 10,
    votes,
    activePeer: {},
    address: '16313739661670634666L',
    setActiveDialog: sinon.spy(),
    voteToggled: sinon.spy(),
    addTransaction: sinon.spy(),
    votesFetched: sinon.spy(),
    delegatesFetched: sinon.spy(),
  };
  beforeEach(() => {
    wrapper = mount(<Voting {...props}></Voting>,
      {
        context: { store },
        childContextTypes: { store: PropTypes.object.isRequired },
      },
    );
  });

  afterEach(() => {
    // Voting.prototype.setStatus.restore();
  });

  it('should render VotingHeader', () => {
    expect(wrapper.find('VotingHeader')).to.have.lengthOf(1);
  });

  it('should render VotingRow', () => {
    expect(wrapper.find('VotingRow')).to.have.lengthOf(delegates.length);
  });

  it('should render Table', () => {
    expect(wrapper.find('Table')).to.have.lengthOf(1);
  });

  it('should define search method to reload delegates based on given query', () => {
    const clock = sinon.useFakeTimers();
    props.delegatesFetched.reset();
    wrapper.instance().search('query');
    clock.tick(2);
    expect(props.delegatesFetched).to.be.calledWith({
      activePeer: props.activePeer,
      offset: 0,
      q: 'query',
      refresh: true,
    });
    clock.restore();
  });
});

