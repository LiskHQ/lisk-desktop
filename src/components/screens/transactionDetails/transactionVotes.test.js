import React from 'react';
import { mount } from 'enzyme';
import * as reactRedux from 'react-redux';
import TransactionVotes from './transactionVotes';
import accounts from '../../../../test/constants/accounts';

const store = {
  network: {
    networks: {
      LSK: { apiVersion: '2' }, // @todo Remove?
    },
  },
};
describe('Transaction Votes', () => {
  let wrapper;
  const props = {
    transaction: {
      type: 3,
      asset: {
        votes: [accounts.delegate_candidate, accounts.delegate]
          .map((item, i) => `${i > 0 ? '+' : '-'}${item.publicKey}`),
      },
    },
    t: v => v,
    delegates: {
      data: {},
      loadData: jest.fn(),
    },
  };
  reactRedux.useSelector = jest.fn().mockImplementation(filter => filter(store));

  it.skip('Should render with added and deleted Votes', () => {
    wrapper = mount(<TransactionVotes {...props} />);
    expect(wrapper).toContainMatchingElements(2, '.votesContainer');
    expect(wrapper.find('.rank').first().text()).toEqual('#-');
    expect(wrapper.find('.username').first().text()).toEqual('Loading...');
  });

  it.skip('Should fetch and render delegate names and ranks', () => {
    wrapper = mount(<TransactionVotes {...props} />);
    wrapper.setProps({
      ...props,
      delegates: {
        data: {
          [accounts.delegate_candidate.publicKey]: {
            ...accounts.delegate_candidate,
            account: { address: accounts.delegate_candidate.address },
          },
          [accounts.delegate.publicKey]: {
            ...accounts.delegate,
            account: { address: accounts.delegate.address },
          },
        },
        loadData: jest.fn(),
      },
    });
    expect(wrapper).toContainMatchingElements(1, '.votesContainer.deleted');
  });
});
