import { act } from 'react-dom/test-utils';
import * as votingActions from '@actions';
import { mountWithRouterAndStore } from '@utils/testHelpers';
import EditVote from './index';

jest.mock('@actions/voting', () => ({
  voteEdited: jest.fn(),
}));

describe('EditVote', () => {
  const propsWithoutSearch = {
    t: str => str,
    history: {
      push: jest.fn(),
      location: {
        search: '',
      },
    },
  };
  const propsWithSearch = {
    t: str => str,
    history: {
      push: jest.fn(),
      location: {
        search: '?address=987665L&modal=editVote',
      },
    },
  };
  const noVote = {};
  const withVotes = {
    '123456L': { confirmed: 1e9, unconfirmed: 1e9 },
    '987665L': { confirmed: 1e9, unconfirmed: 1e9 },
  };
  const state = {
    account: {
      passphrase: 'test',
      info: {
        LSK: { summary: { address: '123456L', balance: 10004674000 } },
        BTC: { summary: { address: '123456L', balance: 0 } },
      },
    },
  };
  it('Should render as addVote when we have not voted to this account yet', () => {
    const wrapper = mountWithRouterAndStore(
      EditVote, propsWithoutSearch, {}, { ...state, voting: noVote },
    );
    expect(wrapper.html()).toContain('Add vote');
    expect(wrapper.find('.confirm').exists()).toBeTruthy();
    expect(wrapper.find('.remove-vote').exists()).not.toBeTruthy();
  });

  it('Should render as addVote when we have not voted to this account yet', () => {
    const wrapper = mountWithRouterAndStore(
      EditVote, propsWithoutSearch, {}, { ...state, voting: withVotes },
    );
    expect(wrapper.html()).toContain('Edit vote');
    expect(wrapper.find('.remove-vote').exists()).toBeTruthy();
  });

  it('should dispatch remove vote for host if not called with address search param', () => {
    const wrapper = mountWithRouterAndStore(
      EditVote, propsWithoutSearch, {}, { ...state, voting: withVotes },
    );
    wrapper.find('.remove-vote').at(0).simulate('click');
    expect(votingActions.voteEdited).toHaveBeenCalledWith([{
      address: '123456L',
      amount: 0,
    }]);
  });

  it('should dispatch remove vote for host if called with address search param', () => {
    const wrapper = mountWithRouterAndStore(
      EditVote, propsWithSearch, {}, { ...state, voting: withVotes },
    );
    wrapper.find('.remove-vote').at(0).simulate('click');
    expect(votingActions.voteEdited).toHaveBeenCalledWith([{
      address: '987665L',
      amount: 0,
    }]);
  });

  it('should dispatch add vote for host if not called with address search param', () => {
    const wrapper = mountWithRouterAndStore(
      EditVote, propsWithoutSearch, {}, { ...state, voting: withVotes },
    );
    wrapper.find('input[name="vote"]').at(0).simulate('change', {
      target: {
        value: 20,
        name: 'vote',
      },
    });
    wrapper.find('.confirm').at(0).simulate('click');
    expect(votingActions.voteEdited).toHaveBeenCalledWith([{
      address: '123456L',
      amount: 2e9,
    }]);
  });

  it('should display error if called with amount that will cause insufficient balance after voting', () => {
    const wrapper = mountWithRouterAndStore(
      EditVote, propsWithoutSearch, {}, { ...state, voting: withVotes },
    );
    let amountField = wrapper.find('input[name="vote"]').at(0);
    amountField.simulate('change', {
      target: {
        value: 100,
        name: 'vote',
      },
    });
    act(() => { jest.advanceTimersByTime(300); });
    wrapper.update();
    amountField = wrapper.find('input[name="vote"]').at(0);

    expect(amountField.find('.error')).toHaveClassName('error');
    expect(wrapper.find('.amount Feedback')).toHaveText('The vote amount is too high. You should keep at least 0.05 LSK available in your account.');
  });

  it('should dispatch remove vote for host if called with address search param', () => {
    const wrapper = mountWithRouterAndStore(
      EditVote, propsWithSearch, {}, { ...state, voting: withVotes },
    );
    wrapper.find('input[name="vote"]').at(0).simulate('change', {
      target: {
        value: 20,
        name: 'vote',
      },
    });
    wrapper.find('.confirm').at(0).simulate('click');
    expect(votingActions.voteEdited).toHaveBeenCalledWith([{
      address: '987665L',
      amount: 2e9,
    }]);
  });
});
