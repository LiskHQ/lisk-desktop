import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import { BrowserRouter as Router } from 'react-router-dom';
import sinon from 'sinon';
import DelegateList from './delegateList';
import { mountWithContext } from './../../../test/utils/mountHelpers';
import store from '../../store';
import history from '../../history';
import i18n from '../../i18n';
import voteFilters from './../../constants/voteFilters';

describe('DelegateList', () => {
  let wrapper;

  const delegates = [
    {
      address: 'address 1',
      username: 'username1',
      publicKey: 'sample_key',
      rank: 12,
    },
    {
      address: 'address 2',
      username: 'username2',
      publicKey: 'sample_key',
      rank: 23,
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

  const mountComponentWithProps = (desiredProps) => {
    const targetWrapper = mount(<Router><DelegateList {...desiredProps}></DelegateList></Router>,
      {
        context: { store, history, i18n },
        childContextTypes: {
          store: PropTypes.object.isRequired,
          history: PropTypes.object.isRequired,
          i18n: PropTypes.object.isRequired,
        },
      },
    );
    return targetWrapper;
  };

  let clock;
  let loadMoreSpy;

  beforeEach(() => {
    clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
    });
    loadMoreSpy = sinon.spy(DelegateList.prototype, 'loadMore');
    wrapper = mountComponentWithProps(props);
  });

  afterEach(() => {
    clock.restore();
    loadMoreSpy.restore();
  });

  it('should render VotingHeader', () => {
    expect(wrapper.find('VotingHeaderRaw')).to.have.lengthOf(1);
  });

  it('should render VotingRow', () => {
    expect(wrapper.find('VotingRow')).to.have.lengthOf(delegates.length);
  });

  it('should render delegate-list section', () => {
    expect(wrapper.find('section.delegate-list')).to.have.lengthOf(1);
  });

  it('should define search method to reload delegates based on given query', () => {
    props.delegatesFetched.reset();
    wrapper.find('.search input')
      .at(0).simulate('change', { nativeEvent: { target: { value: 'query' } } });
    clock.tick(251);
    expect(props.delegatesFetched).to.be.calledWith({
      activePeer: props.activePeer,
      offset: 0,
      q: 'query',
      refresh: true,
    });
    clock.restore();
  });

  it('should call loadMore and not loadDelegates if still loading', () => {
    const loadMoreProps = {
      ...props,
      totalDelegates: 100,
    };
    wrapper = mountComponentWithProps(loadMoreProps);
    const waypoint = wrapper.find('Waypoint').at(1);
    waypoint.props().onEnter();
    expect(loadMoreSpy).to.have.been.calledWith();
    expect(wrapper.find('.delegate-row').length).to.equal(delegates.length);
  });

  it('should call loadMore and loadDelegates if not still loading', () => {
    const loadMoreProps = {
      ...props,
      totalDelegates: 100,
    };
    const loadDelegates = sinon.spy(DelegateList.prototype, 'loadDelegates');
    wrapper = mountWithContext(<DelegateList {...props}/>, { ...store });
    const waypoint = wrapper.find('Waypoint').at(1);

    const nextProps = {
      delegates: [
        ...loadMoreProps.delegates,
        {
          address: 'address 3',
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
    waypoint.props().onEnter();
    expect(loadMoreSpy).to.have.been.calledWith();
    expect(wrapper.find('.delegate-row').length).to.equal(delegates.length + 1);
    loadDelegates.restore();
    clock.restore();
  });

  it('should filter voted delegates', () => {
    const filterVotedProps = {
      ...props,
    };
    wrapper = mountComponentWithProps(filterVotedProps);
    wrapper.find('.transaction-filter-item').at(voteFilters.voted).simulate('click');
    wrapper.update();
    const delegateRow = wrapper.find('.delegate-row');
    expect(delegateRow.length).to.equal(delegates.length - 1);
    expect(delegateRow.find('li').at(2).text()).to.equal(delegates[0].username);
  });

  it('should filter notVoted delegates', () => {
    const filterVotedProps = {
      ...props,
    };
    wrapper = mountComponentWithProps(filterVotedProps);
    wrapper.find('.transaction-filter-item').at(voteFilters.notVoted).simulate('click');
    wrapper.update();
    const delegateRow = wrapper.find('.delegate-row');
    expect(delegateRow.length).to.equal(delegates.length - 1);
    expect(delegateRow.find('li').at(2).text()).to.equal(delegates[1].username);
  });

  it('should show no voted message', () => {
    const emptyMessageProps = {
      ...props,
    };
    emptyMessageProps.delegates = [];
    emptyMessageProps.votes = {};
    wrapper = mountWithContext(<DelegateList {...emptyMessageProps}/>, emptyMessageProps);
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
    expect(delegateRow.text()).to.equal('You have not voted yet.');
  });

  it('should show no results message', () => {
    const emptyMessageProps = {
      ...props,
    };
    emptyMessageProps.delegates = [];
    emptyMessageProps.votes = {};
    wrapper = mountWithContext(<DelegateList {...emptyMessageProps}/>, emptyMessageProps);
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
    expect(delegateRow.text()).to.equal('No delegates found.');
  });
});
