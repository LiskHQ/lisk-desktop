import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { mountWithContext } from './../../../test/utils/mountHelpers';
import FollowAccount from './followAccount';
import * as followedAccounts from '../../actions/followedAccounts';

describe('SendTo: follow account Component', () => {
  let wrapper;
  let props = {
    prevStep: spy(),
    nextStep: spy(),
    address: '12345L',
    t: key => key,
    showConfirmationStep: true,
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

    wrapper.find('.follow-account-button').first().simulate('click');
    expect(followedAccounts.followedAccountAdded).to.not.have.been.calledWith();

    wrapper.find('.account-title input').simulate('change', { target: { value: 'some title' } });
    wrapper.find('.follow-account-button').first().simulate('click');
    expect(followedAccounts.followedAccountAdded).to.have.been.calledWith({
      title: 'some title', address: props.address,
    });
    expect(props.nextStep).to.have.been.calledWith();
  });

  it('Follow button should be disabled if title is empty', () => {
    expect(wrapper.find('.follow-account-button').first()).to.be.disabled();
  });

  it('cancels following', () => {
    wrapper.find('.cancel').first().simulate('click');
    expect(followedAccounts.followedAccountAdded).to.not.have.been.calledWith();
    expect(props.prevStep).to.have.been.calledWith();
  });

  it('adds the account as last step in multiStep', () => {
    const title = 'some title';
    props = {
      prevStep: spy(),
      address: '12345L',
      t: key => key,
      reset: () => {},
    };
    wrapper = mountWithContext(<FollowAccount {...props} />, {});

    wrapper.find('.account-title input').simulate('change', { target: { value: title } });
    wrapper.find('.follow-account-button').first().simulate('click');
    expect(followedAccounts.followedAccountAdded).to.have.been.calledWith({
      title, address: props.address,
    });

    expect(props.prevStep).to.have.been.calledWith();
  });
});
