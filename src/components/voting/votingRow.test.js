import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import store from '../../store';
import VotinRow from './votingRow';

describe('VotinRow', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<VotinRow data={{ dirty: true }}></VotinRow>,
      {
        context: { store },
        childContextTypes: { store: PropTypes.object.isRequired },
      },
    );
  });

  it('should TableRow has class name of "pendingRow" when props.data.pending is true', () => {
    wrapper.setProps({
      data: { pending: true, dirty: true },
    });
    const expectedClass = '_pendingRow';
    const className = wrapper.find('tr').prop('className');
    expect(className).to.contain(expectedClass);
  });

  it(`should TableRow has class name of "votedRow" when props.data.selected
   and props.data.voted are true`, () => {
    wrapper.setProps({
      data: { selected: true, voted: true, dirty: true },
    });
    const expectedClass = '_votedRow';
    const className = wrapper.find('tr').prop('className');
    expect(className).to.contain(expectedClass);
  });

  it(`should TableRow has class name of "downVoteRow" when props.data.selected
   is false and props.data.voted is true`, () => {
    wrapper.setProps({
      data: { selected: false, voted: true, dirty: true },
    });
    const expectedClass = '_downVoteRow';
    const className = wrapper.find('tr').prop('className');
    expect(className).to.contain(expectedClass);
  });

  it(`should TableRow has class name of "upVoteRow" when props.data.selected
   is true and props.data.voted is false`, () => {
    wrapper.setProps({
      data: { selected: true, voted: false, dirty: true },
    });
    const expectedClass = '_upVoteRow';
    const className = wrapper.find('tr').prop('className');
    expect(className).to.contain(expectedClass);
  });
});
