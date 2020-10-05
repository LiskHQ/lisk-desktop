import { act } from 'react-dom/test-utils';

import { mountWithRouter } from '../../../../utils/testHelpers';
import accounts from '../../../../../test/constants/accounts';
import flushPromises from '../../../../../test/unit-test-utils/flushPromises';
import Editor from './editor';

describe('VotingQueue', () => {
  const props = {
    t: str => str,
    account: accounts.genesis,
    nextStep: jest.fn(),
  };
  const mixedVotes = {
    '12345L': { confirmed: 1e10, unconfirmed: 1e10 },
    '123456L': { confirmed: 1e10, unconfirmed: 2e10 },
  };

  const elevenVotes = Array.from(Array(11).keys()).reduce((dict, i) => {
    dict[`123456${i}L`] = { confirmed: 1e10, unconfirmed: 1e10 * i };
    return dict;
  }, {});

  const expensiveVotes = {
    '12345L': { confirmed: 0, unconfirmed: Math.floor(accounts.genesis.balance / 2) },
    '123456L': { confirmed: 0, unconfirmed: Math.floor(accounts.genesis.balance / 2) },
  };

  it('Render only the changed votes', () => {
    const wrapper = mountWithRouter(Editor, { ...props, votes: mixedVotes });
    expect(wrapper.find('VoteListItem')).toHaveLength(1);
  });

  it('Shows an error if trying to vote for more than 10 delegates', () => {
    const wrapper = mountWithRouter(Editor, { ...props, votes: elevenVotes });
    expect(wrapper.find('.feedback').text()).toBe('You can\'t vote for more than 10 delegates.');
  });

  it('Shows an error if trying to vote more than your balance', async () => {
    const wrapper = mountWithRouter(Editor, { ...props, votes: expensiveVotes });
    await flushPromises();
    act(() => { wrapper.update(); });
    expect(wrapper.find('.feedback').text()).toBe('You don\'t have enough LSK in your account.');
  });
});
