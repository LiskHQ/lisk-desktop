import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import { BrowserRouter as Router } from 'react-router-dom';
import sinon from 'sinon';
import Voting from './voting';
import store from '../../store';
import history from '../../history';
import i18n from '../../i18n';

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
    t: key => key,
  };
  beforeEach(() => {
    wrapper = mount(<Router><Voting {...props}></Voting></Router>,
      {
        context: { store, history, i18n },
        childContextTypes: {
          store: PropTypes.object.isRequired,
          history: PropTypes.object.isRequired,
          i18n: PropTypes.object.isRequired,
        },
      },
    );
  });

  afterEach(() => {
    // Voting.prototype.setStatus.restore();
  });

  it('should render VotingHeader', () => {
    expect(wrapper.find('VotingHeaderRaw')).to.have.lengthOf(1);
  });

  it('should render VotingRow', () => {
    expect(wrapper.find('VotingRow')).to.have.lengthOf(delegates.length);
  });

  it('should render Table', () => {
    expect(wrapper.find('Table')).to.have.lengthOf(1);
  });

  it('should define search method to reload delegates based on given query', () => {
    const clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
    });
    props.delegatesFetched.reset();
    wrapper.find('.search input').simulate('change', { target: { value: 'query' } });
    clock.tick(251);
    expect(props.delegatesFetched).to.be.calledWith({
      activePeer: props.activePeer,
      offset: 0,
      q: 'query',
      refresh: true,
    });
    clock.restore();
  });
});

