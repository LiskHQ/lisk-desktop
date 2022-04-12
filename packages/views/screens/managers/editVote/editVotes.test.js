import { act } from 'react-dom/test-utils';
import * as votingActions from '@common/store/actions';
import { mountWithRouterAndStore } from '@common/utilities/testHelpers';
import EditVote from './index';

jest.mock('@transaction/utilities/api', () => ({
  getTransactionFee: jest.fn().mockImplementation(() => Promise.resolve({ value: '0.046' })),
}));

jest.mock('@dpos/store/actions/voting', () => ({
  voteEdited: jest.fn(),
}));

describe('EditVote', () => {
  const genesis = 'lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt';
  const delegate = 'lskehj8am9afxdz8arztqajy52acnoubkzvmo9cjy';
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
        search: `?address=${delegate}&modal=editVote`,
      },
    },
  };
  const noVote = {};
  const withVotes = {
    [genesis]: { confirmed: 1e9, unconfirmed: 1e9 },
    [delegate]: { confirmed: 1e9, unconfirmed: 1e9 },
  };
  const state = {
    account: {
      passphrase: 'test',
      info: {
        LSK: { summary: { address: genesis, balance: 10004674000 } },
        BTC: { summary: { address: genesis, balance: 0 } },
      },
    },
    settings: {
      token: {
        active: 'LSK',
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
      address: genesis,
      amount: 0,
    }]);
  });

  it('should dispatch remove vote for host if called with address search param', () => {
    const wrapper = mountWithRouterAndStore(
      EditVote, propsWithSearch, {}, { ...state, voting: withVotes },
    );
    wrapper.find('.remove-vote').at(0).simulate('click');
    expect(votingActions.voteEdited).toHaveBeenCalledWith([{
      address: delegate,
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
      address: genesis,
      amount: 2e9,
    }]);
  });

  it('should display error if called with amount that will cause insufficient balance after voting', () => {
    const withUpdatedVotes = {
      ...withVotes,
      [genesis]: { confirmed: 0, unconfirmed: 0 },
      [delegate]: { confirmed: 0, unconfirmed: 0 },
    };
    const wrapper = mountWithRouterAndStore(
      EditVote, propsWithoutSearch, {}, { ...state, voting: withUpdatedVotes },
    );
    let amountField = wrapper.find('input[name="vote"]').at(0);
    amountField.simulate('change', {
      target: {
        value: 100,
        name: 'vote',
      },
    });
    wrapper.update();
    act(() => { jest.advanceTimersByTime(300); });
    wrapper.update();
    amountField = wrapper.find('input[name="vote"]').at(0);

    expect(amountField.find('.error')).toHaveClassName('error');
    expect(wrapper.find('.amount Feedback')).toHaveText('Provided amount will result in a wallet with less than the minimum balance.');
  });

  it('should display error when voting if called with amount greater than balance and locked votes for delegate', () => {
    const wrapper = mountWithRouterAndStore(
      EditVote, propsWithoutSearch, {}, { ...state, voting: withVotes },
    );
    let amountField = wrapper.find('input[name="vote"]').at(0);
    amountField.simulate('change', {
      target: {
        value: 210,
        name: 'vote',
      },
    });
    wrapper.update();
    act(() => { jest.advanceTimersByTime(300); });
    wrapper.update();
    amountField = wrapper.find('input[name="vote"]').at(0);

    expect(amountField.find('.error')).toHaveClassName('error');
    expect(wrapper.find('.amount Feedback')).toHaveText('The provided amount is higher than available voting balance.');
  });

  it('should display error when voting if called with amount that is zero or negative', () => {
    const wrapper = mountWithRouterAndStore(
      EditVote, propsWithoutSearch, {}, { ...state, voting: withVotes },
    );
    let amountField = wrapper.find('input[name="vote"]').at(0);
    amountField.simulate('change', {
      target: {
        value: '-0',
        name: 'vote',
      },
    });
    wrapper.update();
    act(() => { jest.advanceTimersByTime(300); });
    wrapper.update();
    amountField = wrapper.find('input[name="vote"]').at(0);

    expect(amountField.find('.error')).toHaveClassName('error');
    expect(wrapper.find('.amount Feedback')).toHaveText('Vote amount can\'t be zero or negative.');
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
      address: delegate,
      amount: 2e9,
    }]);
  });
});
