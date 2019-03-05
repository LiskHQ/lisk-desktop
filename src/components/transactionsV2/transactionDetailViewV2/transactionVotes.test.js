import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import { mount } from 'enzyme';
import i18n from '../../../i18n';
import TransactionVotes from './transactionVotes';

describe('Transaction Votes', () => {
  let wrapper;
  const options = {
    context: { i18n },
  };
  const props = {
    votes: {
      added: [{ username: 'delegate1', rank: '1', account: { address: '123L' } }],
      deleted: [{ username: 'delegate2', rank: '2', account: { address: '12345L' } }],
    },
    t: v => v,
  };

  it('Should render with added and deleted Votes', () => {
    wrapper = mount(<Router><TransactionVotes {...props} /></Router>, options);
    expect(wrapper).toContainMatchingElements(2, '.votesContainer');
    expect(wrapper.find('.rank').first().text()).toEqual(props.votes.added[0].rank);
    expect(wrapper.find('.username').first().text()).toEqual(props.votes.added[0].username);
  });

  it('Should only render added votes and sort by rank', () => {
    const addedProps = {
      ...props,
      votes: {
        added: [
          { username: 'delegate2', rank: '2', account: { address: '12345L' } },
          { username: 'delegate1', rank: '1', account: { address: '123L' } },
        ],
      },
    };
    wrapper = mount(<Router><TransactionVotes {...addedProps} /></Router>, options);
    expect(wrapper).toContainMatchingElements(1, '.votesContainer.added');
    expect(wrapper.find('.rank').at(1).text()).toBe(addedProps.votes.added[0].rank);
  });

  it('Should only render removed votes', () => {
    const deleteProps = {
      ...props,
      votes: {
        deleted: [
          { username: 'delegate2', rank: '2', account: { address: '12345L' } },
          { username: 'delegate1', rank: '1', account: { address: '123L' } },
        ],
      },
    };
    wrapper = mount(<Router><TransactionVotes {...deleteProps} /></Router>, options);
    expect(wrapper).toContainMatchingElements(1, '.votesContainer.deleted');
  });
});
