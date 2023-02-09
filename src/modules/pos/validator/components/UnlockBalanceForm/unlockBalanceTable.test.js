import React from 'react';
import { mount } from 'enzyme';
import { calculateSentStakesAmount, calculateUnlockableAmount } from '@wallet/utils/account';
import { mockSentStakes, mockUnlocks } from '@pos/validator/__fixtures__';
import BalanceTable from './BalanceTable';

describe('unlock transaction Status', () => {
  let wrapper;
  
  const pendingUnlockableUnlocks = mockUnlocks.data.pendingUnlocks;
  const stakes = mockSentStakes.data.stakes;
  const currentBlockHeight = 5000;

  const props = {
    sentStakesAmount: calculateSentStakesAmount(stakes),
    unlockableAmount: calculateUnlockableAmount(pendingUnlockableUnlocks),
    currentBlockHeight,
    pendingUnlockableUnlocks,
  };

  it('renders properly', () => {
    wrapper = mount(<BalanceTable {...props} />);
    expect(wrapper).toContainMatchingElement('.lock-balance-amount-container');
    expect(wrapper.find('.locked-balance').text()).toEqual('280 LSK');
    expect(wrapper.find('.available-balance').text()).toEqual('4,550 LSK');
    expect(wrapper.find('.unlocking-balance')).toHaveLength(pendingUnlockableUnlocks.length);
  });

  it('should not show pendingUnlockableUnlocks if undefined', () => {
    wrapper = mount(<BalanceTable {...props} pendingUnlockableUnlocks={undefined} />);
    expect(wrapper.find('.unlocking-balance')).toHaveLength(0);
  });

  it('should not show available-balance if 0', () => {
    wrapper = mount(<BalanceTable {...props} unlockableAmount={0} />);
    expect(wrapper.find('.available-balance')).toHaveLength(0);
  });

  it('should not show locked-balance if 0', () => {
    wrapper = mount(<BalanceTable {...props} sentStakesAmount={0} />);
    expect(wrapper.find('.locked-balance')).toHaveLength(0);
  });
});
