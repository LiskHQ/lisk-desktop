import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import sinon from 'sinon';
import Voting from './voting';
import store from '../../store';
import * as delegateApi from '../../utils/api/delegate';

describe('Voting', () => {
  let wrapper;

  const listAccountDelegatesMock = sinon.stub(delegateApi, 'listAccountDelegates');
  let listDelegatesMock;
  listAccountDelegatesMock.returnsPromise().resolves({
    delegates: [
      {
        address: 'address 1',
      },
      {
        address: 'address 1',
      },
    ],
  });
  const props = {
    refreshDelegates: false,
    activePeer: {},
    address: '16313739661670634666L',
    votedList: [],
    unvotedList: [],
    addToUnvoted: sinon.spy(),
  };
  beforeEach(() => {
    sinon.spy(Voting.prototype, 'loadVotedDelegates');
    sinon.spy(Voting.prototype, 'loadDelegates');
    sinon.spy(Voting.prototype, 'setStatus');
    listDelegatesMock = sinon.stub(delegateApi, 'listDelegates');
    listDelegatesMock.returnsPromise().resolves({
      delegates: [
        {
          address: 'address 1',
        },
        {
          address: 'address 1',
        },
      ],
      totalCount: 110,
    });
    wrapper = mount(<Voting {...props}></Voting>,
      {
        context: { store },
        childContextTypes: { store: PropTypes.object.isRequired },
      },
    );
  });

  afterEach(() => {
    Voting.prototype.loadVotedDelegates.restore();
    Voting.prototype.loadDelegates.restore();
    Voting.prototype.setStatus.restore();
    listDelegatesMock.restore();
  });

  it('should call "loadVotedDelegates" after component did mount', () => {
    expect(Voting.prototype.loadVotedDelegates).to.have.property('callCount', 1);
    expect(wrapper.state('votedDelegates')).to.have.lengthOf(2);
    expect(Voting.prototype.loadDelegates).to.have.property('callCount', 1);
    expect(Voting.prototype.setStatus).to.have.property('callCount', 2);
  });


  it('should call "loadVotedDelegates" twice when "refreshDelegates" is changed to true', () => {
    const clock = sinon.useFakeTimers();
    clock.tick(100);
    wrapper.setProps({ refreshDelegates: true });
    // it should triger 'wrapper.loadDelegates' after 1 ms
    clock.tick(1);

    expect(Voting.prototype.loadVotedDelegates).to.have.property('callCount', 2);
    clock.tick(10);
    expect(Voting.prototype.loadDelegates).to.have.property('callCount', 1);
  });


  it('should call "loadVotedDelegates" once when "refreshDelegates" is not changed', () => {
    const clock = sinon.useFakeTimers();
    clock.tick(100);
    wrapper.setProps({ votedList: [] });
    // it should triger 'wrapper.loadDelegates' after 1 ms
    clock.tick(1);

    expect(Voting.prototype.loadVotedDelegates).to.have.property('callCount', 1);
    clock.tick(10);
    expect(Voting.prototype.setStatus).to.have.property('callCount', 4);
  });

  it('should "loadMore" calls "loadDelegates" when state.loadMore is true', () => {
    wrapper.instance().loadMore();
    expect(Voting.prototype.loadDelegates).to.have.property('callCount', 2);
  });

  it('should "search" function call "loadDelegates"', () => {
    wrapper.instance().search('query');
    const clock = sinon.useFakeTimers();
    // it should triger 'wrapper.loadDelegates' after 1 ms
    clock.tick(100);
    expect(wrapper.instance().query).to.be.equal('query');
  });
  it('should render VotingHeader', () => {
    expect(wrapper.find('VotingHeader')).to.have.lengthOf(1);
  });

  it('should render Table', () => {
    expect(wrapper.find('Table')).to.have.lengthOf(1);
  });
});

