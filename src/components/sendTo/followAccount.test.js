import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { mountWithContext } from './../../../test/utils/mountHelpers';
import FollowAccount from './followAccount';
import * as followedAccounts from '../../actions/followedAccounts';

describe('SendTo: follow account Component', () => {
  let wrapper;
  const props = {
    prevStep: spy(),
    address: '12345L',
    t: key => key,
  };

  beforeEach(() => {
    spy(followedAccounts, 'followedAccountAdded');
    wrapper = mountWithContext(<FollowAccount {...props} />, {});
  });

  afterEach(() => {
    followedAccounts.followedAccountAdded.restore();
  });

  it('adds the account with given title', () => {
    wrapper.find('.account-title input').simulate('change', { target: { value: 'this is a very long title' } });
    expect(wrapper.find('Input.account-title').text()).to.contain('Title too long');

    wrapper.find('.follow-account').first().simulate('click');
    expect(followedAccounts.followedAccountAdded).to.not.have.been.calledWith();

    wrapper.find('.account-title input').simulate('change', { target: { value: 'some title' } });
    wrapper.find('.follow-account').first().simulate('click');
    expect(followedAccounts.followedAccountAdded).to.have.been.calledWith({
      title: 'some title', address: props.address,
    });
    expect(props.prevStep).to.have.been.calledWith();
  });

  it('adds the account with address as title', () => {
    wrapper.find('.follow-account').first().simulate('click');
    expect(followedAccounts.followedAccountAdded).to.have.been.calledWith({
      title: props.address, address: props.address,
    });
    expect(props.prevStep).to.have.been.calledWith();
  });

  it('cancels following', () => {
    wrapper.find('.cancel').first().simulate('click');
    expect(followedAccounts.followedAccountAdded).to.not.have.been.calledWith();
    expect(props.prevStep).to.have.been.calledWith();
  });
});
