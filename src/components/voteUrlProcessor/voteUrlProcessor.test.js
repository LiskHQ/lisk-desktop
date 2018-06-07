/* eslint-disable */
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import accounts from '../../../test/constants/accounts';
import VoteUrlProcessor from './voteUrlProcessor';

describe('VoteUrlProcessor', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    const account = accounts.delegate;

    props = {
      activePeer: {},
      account,
      clearVoteLookupStatus: sinon.spy(),
      clearVotes: sinon.spy(),
      closeInfo: sinon.spy(),
      urlVotesFound: sinon.spy(),
      settingsUpdated: sinon.spy(),
      notVotedYet: [],
      notFound: [],
      alreadyVoted: [],
      upvotes: [],
      unvotes: [],
      pending: [],
      history: {
        location: {
          search: '',
        },
      },
      urlVoteCount: 0,
      t: key => key,
    };
    wrapper = mount(<VoteUrlProcessor {...props} />);
  });

  it('calls props.urlVotesFound with upvotes if URL contains ?votes=delegate_name', () => {
    wrapper = mount(<VoteUrlProcessor {...{
      ...props,
      history: {
        location: {
          search: '?votes=delegate_name',
        },
      },
    }} />);
    expect(props.urlVotesFound).to.have.been.calledWith({
      activePeer: props.activePeer,
      upvotes: ['delegate_name'],
      unvotes: [],
      address: props.account.address,
    });
    expect(props.settingsUpdated).to.have.been.calledWith({ advancedMode: true });
    });

  it('calls props.urlVotesFound with unvotes if URL contains ?unvotes=delegate_name', () => {
    wrapper = mount(<VoteUrlProcessor {...{
      ...props,
      history: {
        location: {
          search: '?unvotes=delegate_name',
        },
      },
    }} />);
    expect(props.urlVotesFound).to.have.been.calledWith({
      activePeer: props.activePeer,
      upvotes: [],
      unvotes: ['delegate_name'],
      address: props.account.address,
    });
    expect(props.settingsUpdated).to.have.been.calledWith({ advancedMode: true });
  });

  it('displays the selected votes and clears them on closing', () => {
    props.show = true;
    props.upvotes =  ['delegate_1', 'delegate_3'];
    props.unvotes =  ['delegate_2'];

    wrapper = mount(<VoteUrlProcessor {...props} />);

    expect(wrapper.find('.upvotes-message')).to.have.text('delegate_1, delegate_3');
    expect(wrapper.find('.unvotes-message')).to.have.text('delegate_2');

    wrapper.find('.clear-votes').simulate('click');
    expect(props.clearVoteLookupStatus).to.have.been.calledWith();
    expect(props.clearVotes).to.have.been.calledWith();
    expect(props.closeInfo).to.have.been.calledWith();
  });
});

