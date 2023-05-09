import React from 'react';
import { render, screen } from '@testing-library/react';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { useRewardsClaimable } from '@pos/reward/hooks/queries';
import { mockRewardsClaimableWithToken } from '@pos/reward/__fixtures__';
import { convertFromBaseDenom } from '@token/fungible/utils/helpers';
import ClaimRewardsSummaryContent from './index';

jest.mock('@account/hooks', () => ({
  useCurrentAccount: jest.fn(() => [mockSavedAccounts[0], jest.fn()]),
}));

jest.mock('@pos/reward/hooks/queries');

describe('ClaimRewardsSummaryContent', () => {
  const props = {
    t: (key) => key,
  };

  useRewardsClaimable.mockReturnValue({ data: mockRewardsClaimableWithToken });

  it('should display properly', async () => {
    render(<ClaimRewardsSummaryContent {...props} />);

    expect(screen.getByText('Claim reward')).toBeTruthy();

    mockRewardsClaimableWithToken.data.forEach((rewardClaimable) => {
      const { reward, symbol } = rewardClaimable;

      expect(screen.getByText(`${convertFromBaseDenom(reward, rewardClaimable)} ${symbol}`)).toBeTruthy();
    });
  });
});
