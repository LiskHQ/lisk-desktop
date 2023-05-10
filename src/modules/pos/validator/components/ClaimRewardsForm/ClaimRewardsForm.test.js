import { renderWithQueryClient } from 'src/utils/testHelpers';
import { fireEvent, screen } from '@testing-library/react';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { useCurrentAccount } from '@account/hooks';
import { mockRewardsClaimableWithToken } from '@pos/reward/__fixtures__';
import useTransactionPriority from '@transaction/hooks/useTransactionPriority';
import { useRewardsClaimable } from '@pos/reward/hooks/queries';
import useFiatRates from '@common/hooks/useFiatRates';
import { convertFromBaseDenom } from 'src/modules/token/fungible/utils/helpers';
import { mockAppsTokens } from 'src/modules/token/fungible/__fixtures__';
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
jest.mock('@common/hooks/useFiatRates');

jest.mock('@account/hooks/useCurrentAccount');
jest.mock('@pos/reward/hooks/queries');

describe('ClaimRewardsForm', () => {
  const usdRate = '0.9699';
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
  useFiatRates.mockReturnValue({
    LSK: {
      BTC: '0.00003313',
      EUR: '0.8882',
      USD: usdRate,
    },
    COL: {
      BTC: '0.00001382',
      EUR: '0.8864',
      USD: usdRate,
    },
    EVT: {
      BTC: '0.00002574',
      EUR: '0.8877',
      USD: usdRate,
    },
  });

  const nextStep = jest.fn();

  const props = {
    nextStep,
  };

  it('Should display properly', async () => {
    renderWithQueryClient(ClaimRewardsForm, props);
    expect(screen.getByRole('heading', { name: 'Claim rewards' })).toBeTruthy();
    expect(
      screen.getByText(
        'Below are the details of your reward balances, once you click "Claim rewards" the rewarded tokens will be added to your wallet.'
      )
    ).toBeTruthy();
    mockRewardsClaimableWithToken.data.forEach(({ tokenName, symbol, reward }) => {
      expect(screen.getAllByText(tokenName)[0]).toBeTruthy();
      expect(
        screen.getAllByText(`${convertFromBaseDenom(reward, mockAppsTokens.data[0])} ${symbol}`)[0]
      ).toBeTruthy();
    });
    expect(screen.getByRole('button', { name: 'Claim rewards' })).toBeTruthy();
  });

  it('Should call onConfirm when clicking claim rewards', async () => {
    renderWithQueryClient(ClaimRewardsForm, props);
    fireEvent.click(screen.getByRole('button', { name: 'Claim rewards' }));
    expect(props.nextStep).toHaveBeenCalled();
  });
});
