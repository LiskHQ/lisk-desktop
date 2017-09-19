import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import VotingBar from './votingBar';

describe.only('VotingBar', () => {
  let wrapper;
  const props = {
    votes: {
      voted: {
        confirmed: true,
        unconfirmed: false,
      },
      downvote: {
        confirmed: true,
        unconfirmed: true,
      },
      upvote: {
        confirmed: false,
        unconfirmed: true,
      },
      upvote2: {
        confirmed: false,
        unconfirmed: true,
      },
      notVoted: {
        confirmed: false,
        unconfirmed: false,
      },
    },
  };
  beforeEach(() => {
    wrapper = mount(<VotingBar {...props} />);
  });

  it('should render number of upvotes', () => {
    expect(wrapper.find('.upvotes').text()).to.equal('Upvotes: 2');
  });

  it('should render number of downvotes', () => {
    expect(wrapper.find('.downvotes').text()).to.equal('Downvotes: 1');
  });

  it('should render number of downvotes', () => {
    expect(wrapper.find('.total-new-votes').text()).to.equal('Total new votes: 3 / 33');
  });

  it('should render number of total votes', () => {
    expect(wrapper.find('.total-votes').text()).to.equal('Total votes: 3 / 101');
  });

  it('should not render if no upvotes or downvotes', () => {
    wrapper.setProps({ votes: {} });
    expect(wrapper.html()).to.equal(null);
  });
});

