import React from 'react';
import { mount } from 'enzyme';
import accounts from '@tests/constants/accounts';
import { TransactionVotesComp } from './transactionVotes';
// import { Context } from '../transactionDetails';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn().mockImplementation(() => ({
    transaction: {
      type: 3,
      asset: {
        votes: [
          { delegateAddress: 'lsk123', amount: '1000000000' },
          { delegateAddress: 'lsk987', amount: '-2000000000' },
        ],
      },
    },
    account: {},
  })),
}));

describe('Transaction Votes', () => {
  let wrapper;
  const props = {
    t: v => v,
    votedDelegates: {
      data: {},
      loadData: jest.fn(),
    },
  };

  it('Should render with added and deleted Votes', () => {
    wrapper = mount(<TransactionVotesComp {...props} />);
    expect(wrapper).toContainMatchingElements(2, '.vote-item-address');
    expect(wrapper.find('.primaryText').at(0).text()).toEqual('lsk123');
    expect(wrapper.find('.vote-item-value').at(0).text()).toEqual('10 LSK');
    expect(wrapper.find('.primaryText').at(1).text()).toEqual('lsk987');
    expect(wrapper.find('.vote-item-value').at(1).text()).toEqual('-20 LSK');
  });

  it('Should fetch and render delegate names', () => {
    const newProps = {
      ...props,
      votedDelegates: {
        ...props.votedDelegates,
        data: {
          lsk123: {
            ...accounts.delegate_candidate,
            account: { address: accounts.delegate_candidate.address },
          },
          lsk987: {
            ...accounts.delegate,
            account: { address: accounts.delegate.address },
          },
        },
      },
    };
    wrapper = mount(<TransactionVotesComp {...newProps} />);
    expect(newProps.votedDelegates.loadData).toHaveBeenCalled();
    expect(wrapper.find('.primaryText').at(0).text()).toEqual('test');
    expect(wrapper.find('.primaryText').at(1).text()).toEqual('genesis_17');
  });
});
