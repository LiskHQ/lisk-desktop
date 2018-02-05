import PropTypes from 'prop-types';
import React from 'react';

import { expect } from 'chai';
import { mount } from 'enzyme';

import VotesPreview from './index';
import i18n from '../../i18n';

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
    wrapper = mount(<VotesPreview {...props} />, options);
  });


  it('should render number of selection', () => {
    expect(wrapper.find('article.selection h4')).to.have.text('3');
  });

  it('should render number of total votes', () => {
    expect(wrapper.find('article.total h4')).to.have.text('3');
  });

  it('should render number of total votes in red if 101 exceeded', () => {
    let className = wrapper.find('.total-wrapper').props().className;
    expect(className.match(/red/g)).to.be.equal(null);
    const votes = generateNVotes(102);
    wrapper.setProps({ votes });
    wrapper.update();
    expect(wrapper.find('article.total h4')).to.have.text('102');
    className = wrapper.find('.total-wrapper').props().className;
    expect(className.match(/red/g)).to.have.lengthOf(1);
  });

  it('should render number of selection votes in red if 33 exceeded', () => {
    let className = wrapper.find('.selection-wrapper').props().className;
    expect(className.match(/red/g)).to.be.equal(null);
    const votes = generateNVotes(34);
    wrapper.setProps({ votes });
    wrapper.update();
    expect(wrapper.find('article.selection h4')).to.have.text('34');
    className = wrapper.find('.selection-wrapper').props().className;
    expect(className.match(/red/g)).to.have.lengthOf(1);
  });
});
