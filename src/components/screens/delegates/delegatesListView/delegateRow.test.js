import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import DelegateRow from './delegateRow';

describe('DelegateRow', () => {
  const votedStatus = { confirmed: true, unconfirmed: true, publicKey: 'sample_key' };
  const voteStatus = { confirmed: false, unconfirmed: true, publicKey: 'sample_key' };
  const unvoteStatus = { confirmed: true, unconfirmed: false, publicKey: 'sample_key' };
  const pendingStatus = {
    confirmed: true, unconfirmed: true, pending: true, publicKey: 'sample_key',
  };
  const props = {
    data: {
      rank: 12,
      username: 'sample_username',
      account: { address: 'sample_address' },
    },
    voteToggled: () => {},
  };

  it('should have a list item with class name of "pendingRow" when props.data.pending is true', () => {
    const wrapper = mount(<DelegateRow {...props} voteStatus={pendingStatus} />);
    const expectedClass = 'pendingRow';
    const className = wrapper.find('ul').prop('className');
    expect(className).to.contain(expectedClass);
  });

  it.skip('should have a list item with class name of "votedRow" when voteStatus.unconfirmed and confirmed are true', () => {
    const wrapper = mount(<DelegateRow {...props} voteStatus={votedStatus} />);
    const expectedClass = 'votedRow';
    const className = wrapper.find('ul').prop('className');
    expect(className).to.contain(expectedClass);
  });

  it('should have a list item with class name of "downVoteRow" when voteStatus.unconfirmed is false but confirmed is true', () => {
    const wrapper = mount(<DelegateRow {...props} voteStatus={unvoteStatus} />);
    const expectedClass = 'downVoteRow';
    const className = wrapper.find('ul').prop('className');
    expect(className).to.contain(expectedClass);
  });

  it('should have a list item with class name of "upVoteRow" when voteStatus.unconfirmed is false but confirmed is true', () => {
    const wrapper = mount(<DelegateRow {...props} voteStatus={voteStatus} />);
    const expectedClass = 'upVoteRow';
    const className = wrapper.find('ul').prop('className');
    expect(className).to.contain(expectedClass);
  });
});
