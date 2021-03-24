import React from 'react';
import { mount } from 'enzyme';
import BalanceTable from './balanceTable';
import accounts from '../../../../../test/constants/accounts';
import {
  calculateBalanceLockedInVotes,
  calculateUnlockableBalance,
} from '../../../../utils/account';

describe('unlock transaction Status', () => {
  let wrapper;

  const account = {
    ...accounts.genesis,
    dpos: {
      unlocking: [
        { amount: '1000000000', height: { start: 4900, end: 5900 }, delegateAddress: '1L' },
        { amount: '3000000000', height: { start: 100, end: 10100 }, delegateAddress: '1L' },
        { amount: '1000000000', height: { start: 3000, end: 4000 }, delegateAddress: '3L' },
      ],
    },
    sequence: { nonce: '178' },
  };
  const voting = {
    '1L': { confirmed: 500000000000 },
    '2L': { confirmed: 3000000000 },
    '3L': { confirmed: 2000000000 },
  };

  const currentBlockHeight = 5000;

  const props = {
    t: key => key,
    lockedInVotes: calculateBalanceLockedInVotes(voting),
    unlockableBalance: calculateUnlockableBalance(account.unlocking, currentBlockHeight),
    currentBlockHeight,
    account,
  };

  it('renders properly', () => {
    wrapper = mount(<BalanceTable {...props} />);
    expect(wrapper).toContainMatchingElement('.lock-balance-amount-container');
    expect(wrapper.find('.locked-balance').text()).toEqual('5,050 LSK');
    expect(wrapper.find('.available-balance').text()).toEqual('10 LSK');
    expect(wrapper.find('.unlocking-balance')).toHaveLength(2);
  });

  it('renders properly when contains selfvotes', () => {
    const customAccount = {
      ...account,
      unlocking: [
        { amount: '1000000000', height: { start: 4900, end: 5900 }, delegateAddress: '1L' },
        { amount: '3000000000', height: { start: 2500, end: 30500 }, delegateAddress: accounts.genesis.address },
        { amount: '3000000000', height: { start: 2900, end: 30900 }, delegateAddress: accounts.genesis.address },
      ],
    };
    const customVoting = {
      '1L': { confirmed: 500000000000 },
      '2L': { confirmed: 2000000000 },
      [accounts.genesis.address]: { confirmed: 9000000000000 },
    };

    const customProps = {
      ...props,
      account: customAccount,
      lockedInVotes: calculateBalanceLockedInVotes(customVoting),
      unlockableBalance: calculateUnlockableBalance(customAccount.unlocking, currentBlockHeight),
      currentBlockHeight,
    };

    wrapper = mount(<BalanceTable {...customProps} />);
    expect(wrapper).toContainMatchingElement('.lock-balance-amount-container');
    expect(wrapper.find('.locked-balance').text()).toEqual('95,020 LSK');
    expect(wrapper.find('.unlocking-balance')).toHaveLength(3);
  });
});
