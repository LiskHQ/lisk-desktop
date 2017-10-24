import PropTypes from 'prop-types';
import React from 'react';

import { expect } from 'chai';
import { mount } from 'enzyme';

import VotingBar from './votingBar';
import i18n from '../../i18n';
import styles from './votingBar.css';

describe('VotingBar', () => {
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
  };

  const generateNVotes = n => (
    [...Array(n)].map((item, i) => i).reduce(
      (dict, value) => {
        dict[`genesis_${value}`] = { unconfirmed: true };
        return dict;
      }, {})
  );
  const options = {
    context: { i18n },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
    },
  };

  beforeEach(() => {
    wrapper = mount(<VotingBar {...props} />, options);
  });

  it('should render number of upvotes', () => {
    expect(wrapper.find('.upvotes')).to.have.text('Upvotes: 2');
  });

  it('should render number of unvotes', () => {
    expect(wrapper.find('.unvotes')).to.have.text('Downvotes: 1');
  });

  it('should render number of unvotes', () => {
    expect(wrapper.find('.total-new-votes')).to.have.text('Total new votes: 3 / 33');
  });

  it('should render number of total votes', () => {
    expect(wrapper.find('.total-votes')).to.have.text('Total votes: 3 / 101');
  });

  it('should not render if no upvotes or unvotes', () => {
    wrapper.setProps({ votes: {} });
    expect(wrapper.html()).to.equal(null);
  });

  it('should render number of total votes in red if 101 exceeded', () => {
    const votes = generateNVotes(102);

    expect(wrapper.find(`.total-votes .${styles.red}`)).to.be.not.present();
    wrapper.setProps({ votes });
    expect(wrapper.find('.total-votes')).to.have.text('Total votes: 102 / 101');
    expect(wrapper.find(`.total-votes .${styles.red}`)).to.have.text('102');
  });

  it('should render number of total new votes in red if 33 exceeded', () => {
    const votes = generateNVotes(34);
    expect(wrapper.find(`.total-new-votes .${styles.red}`)).to.be.not.present();
    wrapper.setProps({ votes });
    expect(wrapper.find('.total-new-votes')).to.have.text('Total new votes: 34 / 33');
    expect(wrapper.find(`.total-new-votes .${styles.red}`)).to.have.text('34');
  });
});
