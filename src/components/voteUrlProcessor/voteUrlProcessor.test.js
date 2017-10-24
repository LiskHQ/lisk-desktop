import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import VoteUrlProcessor from './voteUrlProcessor';

describe('VoteUrlProcessor', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    const account = {
      balance: 1000e8,
      address: '16313739661670634666L',
      passphrase: 'recipe bomb asset salon coil symbol tiger engine assist pact pumpkin visit',
    };

    props = {
      activePeer: {},
      account,
      clearVoteLookupStatus: sinon.spy(),
      urlVotesFound: sinon.spy(),
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

  it('renders ProgressBar component if props.pending.length > 0', () => {
    wrapper.setProps({
      pending: ['delegate_name'],
      urlVoteCount: 1,
    });
    expect(wrapper.find('ProgressBar')).to.have.length(1);
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
  });

  it('renders .upvotes-message element with a message if props.upvotes.length > 0', () => {
    wrapper.setProps({
      upvotes: ['delegate_name'],
      urlVoteCount: 1,
    });
    expect(wrapper.find('.upvotes-message')).to.have.length(1);
    expect(wrapper.find('.upvotes-message').text()).to.equal('{{count}} delegate names were successfully resolved for voting.');
  });

  it('renders .notFound-message element with a message if props.notFound.length > 0', () => {
    wrapper.setProps({
      notFound: ['delegate_name'],
      urlVoteCount: 1,
    });
    expect(wrapper.find('.notFound-message')).to.have.length(1);
    expect(wrapper.find('.notFound-message').text()).to.equal('{{count}} of the provided delegate names could not be resolved:delegate_name');
  });
});

