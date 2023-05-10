import React from 'react';
import { mount } from 'enzyme';
import {
  calculateSentStakesAmount,
  calculateUnlockedAmount,
  getLockedPendingUnlocks,
} from '@wallet/utils/account';
import { mockSentStakes, mockUnlocks } from '@pos/validator/__fixtures__';
import { mockAppsTokens } from '@token/fungible/__fixtures__';
import usePosToken from '@pos/validator/hooks/usePosToken';
import { useNetworkStatus } from '@network/hooks/queries';
import { mockNetworkStatus } from '@network/__fixtures__';
import BalanceTable from './BalanceTable';

jest.mock('@pos/validator/hooks/usePosToken');
jest.mock('@network/hooks/queries/useNetworkStatus');

describe('unlockBalanceTable', () => {
  let wrapper;

  const pendingUnlocks = mockUnlocks.data.pendingUnlocks;
  const stakes = mockSentStakes.data.stakes;
  const currentBlockHeight = 5000;
  const mockToken = mockAppsTokens.data[0];

  const lockedPendingUnlocks = getLockedPendingUnlocks(pendingUnlocks);

  const props = {
    sentStakesAmount: calculateSentStakesAmount(stakes),
    unlockedAmount: calculateUnlockedAmount(pendingUnlocks),
    currentBlockHeight,
    lockedPendingUnlocks,
    token: mockToken,
  };

  usePosToken.mockReturnValue({ token: mockToken });
  useNetworkStatus.mockReturnValue({ data: mockNetworkStatus });

  it('renders properly', () => {
    wrapper = mount(<BalanceTable {...props} />);
    expect(wrapper).toContainMatchingElement('.lock-balance-amount-container');
    expect(wrapper.find('.locked-balance').text()).toEqual('280 LSK');
    expect(wrapper.find('.available-balance').text()).toEqual('4,550 LSK');
    expect(wrapper.find('.unlocking-balance')).toHaveLength(lockedPendingUnlocks.length);
  });

  it('should not show lockedPendingUnlocks if undefined', () => {
    wrapper = mount(<BalanceTable {...props} lockedPendingUnlocks={undefined} />);
    expect(wrapper.find('.unlocking-balance')).toHaveLength(0);
  });

  it('should not show available-balance if 0', () => {
    wrapper = mount(<BalanceTable {...props} unlockedAmount={0} />);
    expect(wrapper.find('.available-balance')).toHaveLength(0);
  });

  it('should not show locked-balance if 0', () => {
    wrapper = mount(<BalanceTable {...props} sentStakesAmount={0} />);
    expect(wrapper.find('.locked-balance')).toHaveLength(0);
  });
});
