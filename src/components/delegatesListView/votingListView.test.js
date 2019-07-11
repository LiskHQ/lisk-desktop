import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import VotingListViewV2 from './votingListViewV2';
import { mountWithContext } from '../../../test/unit-test-utils/mountHelpers';
import store from '../../store';
import voteFilters from '../../constants/voteFilters';

describe('VotingListViewV2', () => {
  let wrapper;

  const delegates = [
    {
      account: { address: 'address 1' },
      username: 'username1',
      publicKey: 'sample_key',
      rank: 12,
    },
    {
      account: { address: 'address 2' },
      username: 'username2',
      publicKey: 'sample_key',
      rank: 23,
    },
  ];
  const votes = {
    username1: { confirmed: true, unconfirmed: true, publicKey: 'sample_key' },
  };
  const props = {
    account: {},
    delegates,
    votes,
    serverPublicKey: null,
    address: '16313739661670634666L',
    setActiveDialog: sinon.spy(),
    voteToggled: sinon.spy(),
    addTransaction: sinon.spy(),
    loadVotes: sinon.spy(),
    loadDelegates: sinon.spy(),
    t: key => key,
    history: { location: { search: '' } },
  };

  let clock;
  let loadMoreSpy;

  beforeEach(() => {
    clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
    });
    loadMoreSpy = sinon.spy(VotingListViewV2.prototype, 'loadMore');
    wrapper = mountWithContext(<VotingListViewV2 {...props} />, {});
  });

  afterEach(() => {
    clock.restore();
    loadMoreSpy.restore();
  });

  it('should render VotingHeader', () => {
    expect(wrapper.find('VotingHeader')).to.have.lengthOf(1);
  });

  it('should render VoteRow', () => {
    expect(wrapper.find('VoteRow')).to.have.lengthOf(0);
  });

  it('should render delegate-list section', () => {
    expect(wrapper.find('section.delegate-list')).to.have.lengthOf(1);
  });

  it('should define search method to reload delegates based on given query', () => {
    props.loadDelegates.reset();
    wrapper.find('.search input')
      .at(0).simulate('change', { nativeEvent: { target: { value: 'query' } } });
    clock.tick(251);
    expect(props.loadDelegates).to.be.calledWith({
      offset: 0,
      q: 'query',
    });
    clock.restore();
  });

  it('should call loadMore and not loadDelegates if still loading', () => {
    const loadMoreProps = {
      ...props,
    };
    wrapper = mountWithContext(<VotingListViewV2 {...loadMoreProps} />, {});
    const Waypoint = wrapper.find('Waypoint').at(1);
    Waypoint.props().onEnter();
    expect(loadMoreSpy).to.have.been.calledWith();
    expect(wrapper).to.have.exactly(delegates.length).descendants('.delegate-row');
  });

  it('should call loadMore and loadDelegates if not still loading', () => {
    const loadMoreProps = {
      ...props,
    };
    const loadDelegates = sinon.spy(VotingListViewV2.prototype, 'loadDelegates');
    wrapper = mountWithContext(<VotingListViewV2 {...props} />, { ...store });
    const Waypoint = wrapper.find('Waypoint').at(1);

    const nextProps = {
      delegates: [
        ...loadMoreProps.delegates,
        {
          account: { address: 'address 3' },
          username: 'username3',
          publicKey: 'sample_key',
          rank: 23,
        }],
    };

    /*
    Force trigger componentWillUpdate,
    will reset freezeLoading flag to cover loadMore
    */
    wrapper.setProps(nextProps);
    clock.tick(300);
    Waypoint.props().onEnter();
    expect(loadMoreSpy).to.have.been.calledWith();
    expect(wrapper).to.have.exactly(delegates.length + 1).descendants('.delegate-row');
    loadDelegates.restore();
    clock.restore();
  });

  it('should filter voted delegates', () => {
    const filterVotedProps = {
      ...props,
    };
    wrapper = mountWithContext(<VotingListViewV2 {...filterVotedProps} />, {});
    wrapper.find('.transaction-filter-item').at(voteFilters.voted).simulate('click');
    wrapper.update();
    const delegateRow = wrapper.find('.delegate-row');
    expect(delegateRow.length).to.equal(delegates.length - 1);
    expect(delegateRow.find('li').at(2)).to.have.text(delegates[0].username);
  });

  it('should filter notVoted delegates', () => {
    const filterVotedProps = {
      ...props,
    };
    wrapper = mountWithContext(<VotingListViewV2 {...filterVotedProps} />, {});
    wrapper.find('.transaction-filter-item').at(voteFilters.notVoted).simulate('click');
    wrapper.update();
    const delegateRow = wrapper.find('.delegate-row');
    expect(delegateRow.length).to.equal(delegates.length - 1);
    expect(delegateRow.find('li').at(2)).to.have.text(delegates[1].username);
  });

  it('should show no voted message', () => {
    const emptyMessageProps = {
      ...props,
    };
    emptyMessageProps.delegates = [];
    emptyMessageProps.votes = {};
    wrapper = mountWithContext(<VotingListViewV2 {...emptyMessageProps} />, {});
    const nextProps = {
      delegates: [],
    };

    /*
    force to have no delegates and
    trigger voted filter
    */
    wrapper.setProps(nextProps);
    clock.tick(300);
    wrapper.find('.transaction-filter-item').at(voteFilters.voted).simulate('click');
    wrapper.update();
    const delegateRow = wrapper.find('.empty-message');
    expect(delegateRow).to.have.text('You have not voted yet.');
  });

  it('should show no results message', () => {
    const emptyMessageProps = {
      ...props,
    };
    emptyMessageProps.delegates = [];
    emptyMessageProps.votes = {};
    wrapper = mountWithContext(<VotingListViewV2 {...emptyMessageProps} />, {});
    const nextProps = {
      delegates: [delegates[1]],
    };

    /*
    force to reset isInitial flag
    and then reset delegates
    */
    wrapper.setProps(nextProps);
    clock.tick(300);
    wrapper.update();

    wrapper.setProps({ delegates: [] });
    const delegateRow = wrapper.find('.empty-message');
    expect(delegateRow).to.have.text('No delegates found.');
  });
});
