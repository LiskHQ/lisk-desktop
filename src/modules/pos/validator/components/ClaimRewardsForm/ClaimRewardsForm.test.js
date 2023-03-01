import { renderWithQueryClient } from 'src/utils/testHelpers';
import { fireEvent, screen } from '@testing-library/react';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { useCurrentAccount } from '@account/hooks';
import { mockRewardsClaimableWithToken } from '@pos/reward/__fixtures__';
import useTransactionPriority from '@transaction/hooks/useTransactionPriority';
import { useRewardsClaimable } from '@pos/reward/hooks/queries';
import ClaimRewardsForm from './index';

jest.mock('@account/hooks/useDeprecatedAccount', () => ({
  useDeprecatedAccount: jest.fn().mockReturnValue({
    isSuccess: true,
    isLoading: false,
  }),
}));
jest.mock('@transaction/hooks/useTransactionPriority');
jest.mock('@block/hooks/queries/useLatestBlock');
jest.mock('@transaction/api');

jest.mock('@account/hooks/useCurrentAccount');
jest.mock('@pos/reward/hooks/queries');

describe('ClaimRewardsForm', () => {
  useCurrentAccount.mockReturnValue([mockSavedAccounts[0]]);
  useRewardsClaimable.mockReturnValue({ data: mockRewardsClaimableWithToken });
  useTransactionPriority.mockImplementation(() => [
    { selectedIndex: 1 },
    () => {},
    [
      { title: 'Low', value: 0.001 },
      { title: 'Medium', value: 0.005 },
      { title: 'High', value: 0.01 },
      { title: 'Custom', value: undefined },
    ],
  ]);

  const nextStep = jest.fn();

  const props = {
    nextStep,
  };

  it('Should display properly', async () => {
    renderWithQueryClient(ClaimRewardsForm, props);
    expect(screen.getByRole('heading', { name: 'Claim rewards' })).toBeTruthy();
    expect(
      screen.getByText(
        'Below are the details of your reward balances, you can continue to claim your rewards and they will be transferred to your wallet balance.'
      )
    ).toBeTruthy();
    mockRewardsClaimableWithToken.data.forEach(({ tokenName, reward }) => {
      expect(screen.getAllByText(tokenName)[0]).toBeTruthy();
      expect(screen.getAllByText(reward)[0]).toBeTruthy();
    });
    expect(screen.getByRole('button', { name: 'Claim rewards' })).toBeTruthy();
  });

  it('Should call onConfirm when clicking claim rewards', async () => {
    renderWithQueryClient(ClaimRewardsForm, props);
    fireEvent.click(screen.getByRole('button', { name: 'Claim rewards' }));
    expect(props.nextStep).toHaveBeenCalled();
  });
});
