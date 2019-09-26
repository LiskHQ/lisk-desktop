import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';
import i18n from '../../../../i18n';
import Voting from './voting';

describe('Voting', () => {
  const votes = {
    username3: { confirmed: false, unconfirmed: true, publicKey: 'sample_key3' },
    username1: { confirmed: true, unconfirmed: false, publicKey: 'sample_key1' },
  };
  const store = configureMockStore([])({
    voting: {
      votes,
      delegates: [],
    },
    settings: {
      token: {
        active: 'LSK',
      },
    },
    network: {
      status: { online: true },
      name: 'Custom Node',
      networks: {
        LSK: {
          nodeUrl: 'hhtp://localhost:4000',
          nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
        },
      },
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
    const wrapper = mount(<Router><Voting {...props} /></Router>, options);
    expect(wrapper.find('VotingSummary')).toHaveLength(1);
  });

  it('should go to result box with confirm button and then back to delegates', () => {
    const wrapper = mount(<Router><Voting {...{ ...props, votes }} /></Router>, options);
    wrapper.find('.confirm-button').at(0).simulate('click');
    expect(wrapper.find('.result-box-header')).toHaveLength(1);
    wrapper.find('.back-to-delegates-button').at(0).simulate('click');
    expect(props.history.push).toHaveBeenCalledWith('/delegates');
  });

  it('should show report error link when confirm button is clicked and voting fails', () => {
    voteResult = { success: false };
    const wrapper = mount(<Router><Voting {...{ ...props, votes }} /></Router>, options);
    wrapper.find('.confirm-button').at(0).simulate('click');
    expect(wrapper.find('.report-error-link')).toHaveLength(1);
  });

  it('should go to Delegates page when cancel button is clicked', () => {
    const wrapper = mount(<Router><Voting {...props} /></Router>, options);
    wrapper.find('.cancel-button').at(0).simulate('click');
    expect(props.history.push).toHaveBeenCalledWith('/delegates');
  });
});
