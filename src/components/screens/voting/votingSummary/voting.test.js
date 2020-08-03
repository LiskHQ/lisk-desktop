/* eslint-disable */
import React from 'react';
import { mount } from 'enzyme';
import Voting from './voting';
import DialogHolder from '../../../toolbox/dialog/holder';
import { mountWithRouter } from '../../../../utils/testHelpers';

describe('Voting', () => {
  const votes = {
    username3: { confirmed: false, unconfirmed: true, publicKey: 'sample_key3' },
    username1: { confirmed: true, unconfirmed: false, publicKey: 'sample_key1' },
  };
  let voteResult = { success: true };
  const props = {
    votes: {},
    account: {},
    voteLookupStatus: {
      pending: [],
      notFound: [],
      alreadyVoted: [],
    },
    settings: {
      token: {
        active: 'LSK',
      },
    },
    votePlaced: ({ callback }) => callback(voteResult),
    t: key => key,
    history: { push: jest.fn() },
  };

  it('should render VotingSummary', () => {
    const wrapper = mountWithRouter(Voting, props);
    expect(wrapper.find('VotingSummary')).toHaveLength(1);
  });

  it('should go to result box with confirm button and then back to delegates', () => {
    DialogHolder.hideDialog = jest.fn();
    const wrapper = mountWithRouter(Voting, { ...props, votes });
    wrapper.find('.confirm-button').at(0).simulate('click');
    expect(wrapper.find('.result-box-header')).toHaveLength(1);
  });

  it('should show report error link when confirm button is clicked and voting fails', () => {
    voteResult = { success: false };
    const wrapper = mountWithRouter(Voting, { ...props, votes });
    wrapper.find('.confirm-button').at(0).simulate('click');
    expect(wrapper.find('.report-error-link')).toHaveLength(1);
  });

  it('should go to Delegates page when cancel button is clicked', () => {
    DialogHolder.hideDialog = jest.fn();
    const wrapper = mountWithRouter(Voting, props);
    wrapper.find('.cancel-button').at(0).simulate('click');
    expect(DialogHolder.hideDialog).toHaveBeenCalled();
  });
});
