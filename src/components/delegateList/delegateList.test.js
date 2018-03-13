import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import { BrowserRouter as Router } from 'react-router-dom';
import sinon from 'sinon';
import DelegateList from './delegateList';
import store from '../../store';
import history from '../../history';
import i18n from '../../i18n';

/* eslint-disable mocha/no-exclusive-tests */
describe.only('DelegateList', () => {
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
  beforeEach(() => {
    wrapper = mountComponentWithProps(props);
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

  it('should render delegate-list section', () => {
    expect(wrapper.find('section.delegate-list')).to.have.lengthOf(1);
  });

  it('should define search method to reload delegates based on given query', () => {
    const clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
    });
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

  it('should loadMore when scrolling', () => {
    const showChangeSummeryProps = {
      ...props,
      showChangeSummery: false,
      totalDelegates: 100,
    };
    wrapper = mountComponentWithProps(showChangeSummeryProps);

    expect(wrapper.find('h2.voting-header')).to.have.lengthOf(1);
    expect(wrapper.find('h2.voting-header').text()).to.be.equal('Delegate List');


    const delegateVote = wrapper.find('.delegate-row').at(0).find('label');

    console.log(delegateVote);

    delegateVote.simulate('click');

    console.log(wrapper.find('.next'));
    wrapper.find('.next').at(0).simulate('click');

    expect(wrapper.find('h2.voting-header')).to.have.lengthOf(1);
    expect(wrapper.find('h2.voting-header').text()).to.be.equal('Your selection');

    // clock.tick(300);
    // wrapper.setProps({ state: { showChangeSummery: true } });
    // expect(wrapper.find('h2.voting-header')).to.have.lengthOf(1);
    // clock.restore();
  });
});
/* eslint-enable mocha/no-exclusive-tests */
