import React from 'react';
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
      added: [{ username: 'delegate1', rank: '1' }],
      deleted: [{ username: 'delegate2', rank: '2' }],
    },
    t: v => v,
  };

  it('Should render with added and deleted Votes', () => {
    wrapper = mount(<TransactionVotes {...props} />, options);
    expect(wrapper).toContainMatchingElements(2, '.votesContainer');
    expect(wrapper.find('.rank').first().text()).toEqual(props.votes.added[0].rank);
    expect(wrapper.find('.username').first().text()).toEqual(props.votes.added[0].username);
  });

  it('Should only render added votes and sort by rank', () => {
    const addedProps = {
      ...props,
      votes: {
        added: [{ username: 'delegate2', rank: '2' }, { username: 'delegate1', rank: '1' }],
      },
    };
    wrapper = mount(<TransactionVotes {...addedProps} />, options);
    expect(wrapper).toContainMatchingElements(1, '.votesContainer.added');
    expect(wrapper.find('.rank').at(1).text()).toBe('2');
  });

  it('Should only render removed votes', () => {
    const deleteProps = {
      ...props,
      votes: {
        deleted: [{ username: 'delegate2', rank: '2' }, { username: 'delegate1', rank: '1' }],
      },
    };
    wrapper = mount(<TransactionVotes {...deleteProps} />, options);
    expect(wrapper).toContainMatchingElements(1, '.votesContainer.deleted');
  });
});
