import React from 'react';
import { mount } from 'enzyme';
import {
  calculateBalanceLockedInVotes,
  calculateUnlockableBalance,
} from '@wallet/utils/account';
import accounts from '@tests/constants/wallets';
import BalanceTable from './unlockBalanceTable';

describe('unlock transaction Status', () => {
  let wrapper;

  const account = {
    ...accounts.genesis,
    dpos: {
      unlocking: [
        { amount: '1000000000', height: { start: 4900, end: 5900 }, delegateAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11' },
        { amount: '3000000000', height: { start: 100, end: 10100 }, delegateAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11' },
        { amount: '1000000000', height: { start: 3000, end: 4000 }, delegateAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y13' },
      ],
    },
    sequence: { nonce: '178' },
  };
  const voting = {
    lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11: { confirmed: 500000000000 },
    lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y12: { confirmed: 3000000000 },
    lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y13: { confirmed: 2000000000 },
  };

  const currentBlockHeight = 5000;

  const props = {
    t: key => key,
    lockedInVotes: calculateBalanceLockedInVotes(voting),
    unlockableBalance: calculateUnlockableBalance(account.dpos.unlocking, currentBlockHeight),
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
      dpos: {
        unlocking: [
          { amount: '1000000000', height: { start: 4900, end: 5900 }, delegateAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11' },
          { amount: '3000000000', height: { start: 2500, end: 30500 }, delegateAddress: accounts.genesis.summary.address },
          { amount: '3000000000', height: { start: 2900, end: 30900 }, delegateAddress: accounts.genesis.summary.address },
        ],
      },
    };
    const customVoting = {
      lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11: { confirmed: 500000000000 },
      lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y12: { confirmed: 2000000000 },
      [accounts.genesis.summary.address]: { confirmed: 9000000000000 },
    };

    const customProps = {
      ...props,
      account: customAccount,
      lockedInVotes: calculateBalanceLockedInVotes(customVoting),
      unlockableBalance: calculateUnlockableBalance(
        customAccount.dpos.unlocking,
        currentBlockHeight,
      ),
      currentBlockHeight,
    };

    wrapper = mount(<BalanceTable {...customProps} />);
    expect(wrapper).toContainMatchingElement('.lock-balance-amount-container');
    expect(wrapper.find('.locked-balance').text()).toEqual('95,020 LSK');
    expect(wrapper.find('.unlocking-balance')).toHaveLength(3);
  });
});
