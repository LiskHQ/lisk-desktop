import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';
import i18n from '../../i18n';
import VotingV2 from './votingV2';

describe('VotingV2', () => {
  const votes = {
    username3: { confirmed: false, unconfirmed: true, publicKey: 'sample_key3' },
    username1: { confirmed: true, unconfirmed: false, publicKey: 'sample_key1' },
  };
  const store = configureMockStore([])({
    voting: {
      votes,
    },
  });
  const options = {
    context: { i18n, store },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
      store: PropTypes.object.isRequired,
    },
  };
  let voteResult = { success: true };
  const props = {
    votes: {},
    account: {},
    votePlaced: ({ goToNextStep }) => goToNextStep(voteResult),
    t: key => key,
    history: { push: jest.fn() },
  };

  it('should render VotingSummary', () => {
    const wrapper = mount(<Router><VotingV2 {...props} /></Router>, options);
    expect(wrapper.find('VotingSummary')).toHaveLength(1);
  });

  it('should go to VotingResult with confirm button and then back to delegates', () => {
    const wrapper = mount(<Router><VotingV2 {...{ ...props, votes } } /></Router>, options);
    wrapper.find('.confirm-button').at(0).simulate('click');
    expect(wrapper.find('VotingResult')).toHaveLength(1);
    wrapper.find('.back-to-delegates').at(0).simulate('click');
    expect(props.history.push).toHaveBeenCalledWith('/delegatesV2');
  });

  it('should show report error link when confirm button is clicked and voting fails', () => {
    voteResult = { success: false };
    const wrapper = mount(<Router><VotingV2 {...{ ...props, votes } } /></Router>, options);
    wrapper.find('.confirm-button').at(0).simulate('click');
    expect(wrapper.find('.report-error-link')).toHaveLength(1);
  });

  it('should go to Delegates page when cancel button is clicked', () => {
    const wrapper = mount(<Router><VotingV2 {...props} /></Router>, options);
    wrapper.find('.cancel-button').at(0).simulate('click');
    expect(props.history.push).toHaveBeenCalledWith('/delegatesV2');
  });
});
