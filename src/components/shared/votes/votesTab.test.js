import React from 'react';
import { mount } from 'enzyme';
import * as reactRedux from 'react-redux';
import accounts from '../../../../test/constants/accounts';
import routes from '../../../constants/routes';
import VotesTab from './votesTab';

describe('Votes Tab Component', () => {
  let wrapper;
  const props = {
    address: accounts.genesis.address,
    history: { push: jest.fn() },
    votes: {
      data: [],
      loadData: jest.fn(),
    },
    delegates: {
      data: {},
      loadData: jest.fn(),
    },
    t: v => v,
  };

  const network = {
    network: {
      networks: {
        LSK: { apiVersion: '2' },
      },
    },
  };

  reactRedux.useSelector = jest.fn().mockImplementation(() => network);

  afterEach(() => {
    props.votes.loadData.mockRestore();
    props.delegates.loadData.mockRestore();
  });

  const setup = data => mount(<VotesTab {...data} />);

  it('Should render with empty state', () => {
    wrapper = setup(props);
    expect(wrapper.find('.empty-state')).toIncludeText('This account doesn’t have any votes.');
  });

  it('Should show loading state', () => {
    wrapper = setup({ ...props, votes: { ...props.votes, isLoading: true } });
    expect(wrapper).toContainMatchingElement('.loading');
  });

  it('Should render only 30 visible and clicking show more shows 30 more', () => {
    const votes = [...Array(101)].map((_, i) => ({
      username: `user_${i}`,
      address: `${i}L`,
      rank: i + 1,
      rewards: '40500000000',
      productivity: Math.random() * 100,
      vote: '9999988456732672',
    }));
    wrapper = setup({ ...props });
    wrapper.setProps({ votes: { ...props.votes, data: votes } });
    wrapper.update();
    expect(wrapper).toContainMatchingElements(30, 'VoteRow');
    wrapper.find('button.load-more').simulate('click');
    expect(wrapper).toContainMatchingElements(60, 'VoteRow');
  });

  it('Should go to account page on clicking row', () => {
    const votes = [...Array(101)].map((_, i) => ({
      username: `user_${i}`,
      address: `${i}L`,
      rank: i + 1,
      rewards: '40500000000',
      productivity: Math.random() * 100,
      vote: '9999988456732672',
    }));
    wrapper = setup({ ...props });
    wrapper.setProps({ votes: { ...props.votes, data: votes } });
    wrapper.update();
    wrapper.find('VoteRow').at(0).simulate('click');
    expect(props.history.push).toBeCalledWith(`${routes.accounts.pathPrefix}${routes.accounts.path}/0L`);
  });

  it('Should filter votes per username and show error message if no results found', () => {
    const votes = [...Array(101)].map((_, i) => ({
      username: `user_${i}`,
      address: `${i}L`,
      rank: i + 1,
      rewards: '40500000000',
      productivity: Math.random() * 100,
      vote: '9999988456732672',
    }));
    wrapper = setup({ ...props });
    wrapper.setProps({ votes: { ...props.votes, data: votes } });
    wrapper.update();
    wrapper.find('.filterHolder input').simulate('change', { target: { value: 'user_100' } });
    jest.advanceTimersByTime(300);
    expect(wrapper).toContainMatchingElements(1, 'VoteRow');
    wrapper.find('.filterHolder input').simulate('change', { target: { value: 'not user name' } });
    jest.advanceTimersByTime(300);
    expect(wrapper).toContainMatchingElements(1, 'Empty');
  });
});
