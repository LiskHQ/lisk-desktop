import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import store from '../../store';
import VotinRow from './votingRow';

describe('VotinRow', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<VotinRow data={{}}></VotinRow>,
      {
        context: { store },
        childContextTypes: { store: PropTypes.object.isRequired },
      },
    );
  });

  it('should TableRow has class name of "pendingRow" when props.data.pending is true', () => {
    wrapper.setProps({
      data: { pending: true },
    });
    const expectedClass = /_pendingRow/g;
    const html = wrapper.find('tr').html();
    expect(html.match(expectedClass)).to.have.lengthOf(1);
  });

  it(`should TableRow has class name of "votedRow" when props.data.selected
   and props.data.voted are true`, () => {
    wrapper.setProps({
      data: { selected: true, voted: true },
    });
    const expectedClass = /_votedRow/g;
    const html = wrapper.find('tr').html();
    expect(html.match(expectedClass)).to.have.lengthOf(1);
  });

  it(`should TableRow has class name of "downVoteRow" when props.data.selected
   is false and props.data.voted is true`, () => {
    wrapper.setProps({
      data: { selected: false, voted: true },
    });
    const expectedClass = /_downVoteRow/g;
    const html = wrapper.find('tr').html();
    expect(html.match(expectedClass)).to.have.lengthOf(1);
  });

  it(`should TableRow has class name of "upVoteRow" when props.data.selected
   is true and props.data.voted is false`, () => {
    wrapper.setProps({
      data: { selected: true, voted: false },
    });
    const expectedClass = /_upVoteRow/g;
    const html = wrapper.find('tr').html();
    expect(html.match(expectedClass)).to.have.lengthOf(1);
  });
});
