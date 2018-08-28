import React from 'react';

import { spy } from 'sinon';
import { expect } from 'chai';
import { mountWithContext } from './../../../test/utils/mountHelpers';
import VotesPreview from './index';

// To-do enable this tests when votesPreview is implemented
describe('votesPreview', () => {
  let wrapper;
  const props = {
    votes: {
      voted: {
        confirmed: true,
        unconfirmed: false,
      },
      unvote: {
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
    nextStep: spy(),
    updateList: spy(),
  };

  const generateNVotes = n => (
    [...Array(n)].map((item, i) => i).reduce((dict, value) => {
      dict[`genesis_${value}`] = { unconfirmed: true };
      return dict;
    }, {})
  );

  const setupStep = ((votes) => {
    const storeState = {
      account: { balance: 100e8 },
      voting: {
        votes,
        delegates: [],
      },
    };
    wrapper = mountWithContext(<VotesPreview {...props} />, { storeState });
  });


  it('should render number of selection', () => {
    setupStep(props.votes);
    expect(wrapper.find('.current-votes')).to.have.text('3/33');
  });

  it('should render number of total votes', () => {
    setupStep(props.votes);
    expect(wrapper.find('.total-votes')).to.have.text('3/101');
  });

  it('should provide error message if number of votes exceeds 102', () => {
    setupStep(generateNVotes(102));
    expect(wrapper.find('.total-votes')).to.have.text('102/101');
    expect(wrapper).to.exactly(1).descendants('.votes-error');
  });

  it('should provide error message if number votes exceeds 33', () => {
    setupStep(generateNVotes(34));
    expect(wrapper.find('.current-votes')).to.have.text('34/33');
    expect(wrapper).to.exactly(1).descendants('.votes-error');
  });
});
