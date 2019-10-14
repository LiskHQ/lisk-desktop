import React from 'react';
import { mount } from 'enzyme';
import Voting from './voting';

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
    const wrapper = mount(<Voting {...props} />);
    expect(wrapper.find('VotingSummary')).toHaveLength(1);
  });

  it('should go to result box with confirm button and then back to delegates', () => {
    const wrapper = mount(<Voting {...{ ...props, votes }} />);
    wrapper.find('.confirm-button').at(0).simulate('click');
    expect(wrapper.find('.result-box-header')).toHaveLength(1);
    wrapper.find('.back-to-delegates-button').at(0).simulate('click');
    expect(props.history.push).toHaveBeenCalledWith('/delegates');
  });

  it('should show report error link when confirm button is clicked and voting fails', () => {
    voteResult = { success: false };
    const wrapper = mount(<Voting {...{ ...props, votes }} />);
    wrapper.find('.confirm-button').at(0).simulate('click');
    expect(wrapper.find('.report-error-link')).toHaveLength(1);
  });

  it('should go to Delegates page when cancel button is clicked', () => {
    const wrapper = mount(<Voting {...props} />);
    wrapper.find('.cancel-button').at(0).simulate('click');
    expect(props.history.push).toHaveBeenCalledWith('/delegates');
  });
});
