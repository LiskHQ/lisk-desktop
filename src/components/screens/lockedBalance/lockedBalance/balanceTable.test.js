import React from 'react';
import { mount } from 'enzyme';
import BalanceTable from './balanceTable';
import accounts from '../../../../../test/constants/accounts';
import {
  calculateLockedBalance,
  calculateUnlockableBalance,
} from '../../../../utils/account';

describe('unlock transaction Status', () => {
  let wrapper;

  const account = {
    ...accounts.genesis,
    unlocking: [
      { amount: '1000000000', height: { start: 4900, end: 5900 }, delegateAddress: '1L' },
      { amount: '3000000000', height: { start: 100, end: 200 }, delegateAddress: '1L' },
      { amount: '1000000000', height: { start: 3000, end: 4000 }, delegateAddress: '3L' },
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
    availableBalance: calculateUnlockableBalance(account, currentBlock),
    currentBlock,
    account,
  };

  it('renders properly', () => {
    wrapper = mount(<BalanceTable {...props} />);
    expect(wrapper).toContainMatchingElement('.lock-balance-amount-container');
    expect(wrapper.find('.locked-balance').text()).toEqual('5,050 LSK');
    expect(wrapper.find('.available-balance').text()).toEqual('30 LSK');
    expect(wrapper.find('.unlocking-balance')).toHaveLength(2);
  });

  it('renders properly when contains selfvotes', () => {
    const customAccount = {
      ...account,
      unlocking: [
        { amount: '1000000000', height: { start: 4900, end: 5900 }, delegateAddress: '1L' },
        { amount: '3000000000', height: { start: 2500, end: 3500 }, delegateAddress: accounts.genesis.address },
        { amount: '3000000000', height: { start: 2900, end: 3900 }, delegateAddress: accounts.genesis.address },
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
      availableBalance: calculateUnlockableBalance(customAccount, currentBlock),
    };

    wrapper = mount(<BalanceTable {...customProps} />);
    expect(wrapper).toContainMatchingElement('.lock-balance-amount-container');
    expect(wrapper.find('.locked-balance').text()).toEqual('95,020 LSK');
    expect(wrapper.find('.unlocking-balance')).toHaveLength(3);
  });
});
