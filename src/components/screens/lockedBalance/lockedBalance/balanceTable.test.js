import React from 'react';
import { mount } from 'enzyme';
import BalanceTable from './balanceTable';
import accounts from '../../../../../test/constants/accounts';
import {
  calculateLockedBalance,
  calculateAvailableBalance,
} from '../../../../utils/account';

describe('unlock transaction Status', () => {
  let wrapper;

  const account = {
    ...accounts.genesis,
    unlocking: [
      { amount: '1000000000', unvoteHeight: 4900, delegateAddress: '1L' },
      { amount: '3000000000', unvoteHeight: 100, delegateAddress: '1L' },
      { amount: '1000000000', unvoteHeight: 3000, delegateAddress: '3L' },
    ],
    votes: [
      { amount: '500000000000', delegateAddress: '1L' },
      { amount: '3000000000', delegateAddress: '3L' },
      { amount: '2000000000', delegateAddress: '1L' },
    ],
    nonce: '178',
  };
  const currentBlockHeight = 5000;
  const currentBlock = { height: currentBlockHeight };

  const props = {
    t: key => key,
    lockedBalance: calculateLockedBalance(account),
    availableBalance: calculateAvailableBalance(account, currentBlock),
    currentBlock,
    account,
  };

  it('renders properly', () => {
    wrapper = mount(<BalanceTable {...props} />);
    expect(wrapper).toContainMatchingElement('.lock-balance-amount-container');
    expect(wrapper.find('.locked-balance').text()).toEqual('5050 LSK');
    expect(wrapper.find('.available-balance').text()).toEqual('30 LSK');
    expect(wrapper.find('.unlocking-balance')).toHaveLength(2);
  });

  it('renders properly when contains selfvotes', () => {
    const customAccount = {
      ...account,
      unlocking: [
        { amount: '1000000000', unvoteHeight: 4900, delegateAddress: '1L' },
        { amount: '3000000000', unvoteHeight: 2500, delegateAddress: accounts.genesis.address },
        { amount: '3000000000', unvoteHeight: 2900, delegateAddress: accounts.genesis.address },
      ],
      votes: [
        { amount: '500000000000', delegateAddress: '1L' },
        { amount: '9000000000000', delegateAddress: accounts.genesis.address },
        { amount: '2000000000', delegateAddress: '1L' },
      ],
    };

    const customProps = {
      ...props,
      account: customAccount,
      lockedBalance: calculateLockedBalance(customAccount),
      availableBalance: calculateAvailableBalance(customAccount, currentBlock),
    };

    wrapper = mount(<BalanceTable {...customProps} />);
    expect(wrapper).toContainMatchingElement('.lock-balance-amount-container');
    expect(wrapper.find('.locked-balance').text()).toEqual('95020 LSK');
    expect(wrapper.find('.available-balance').text()).toEqual('0 LSK');
    expect(wrapper.find('.unlocking-balance')).toHaveLength(3);
  });
});
