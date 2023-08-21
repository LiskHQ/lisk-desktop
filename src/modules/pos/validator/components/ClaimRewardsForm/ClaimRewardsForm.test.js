import { smartRender } from 'src/utils/testHelpers';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { useCurrentAccount } from '@account/hooks';
import { mockRewardsClaimableWithToken } from '@pos/reward/__fixtures__';
import useTransactionPriority from '@transaction/hooks/useTransactionPriority';
import { useTokenBalances } from '@token/fungible/hooks/queries';
import { useRewardsClaimable } from '@pos/reward/hooks/queries';
import * as transactionApi from '@transaction/api';
import useFiatRates from '@common/hooks/useFiatRates';
import { convertFromBaseDenom } from 'src/modules/token/fungible/utils/helpers';
import { mockAppsTokens } from 'src/modules/token/fungible/__fixtures__';
import { useTransactionEstimateFees } from 'src/modules/transaction/hooks/queries';
import useSettings from 'src/modules/settings/hooks/useSettings';
import { useAuth } from 'src/modules/auth/hooks/queries';
import { mockAuth } from 'src/modules/auth/__fixtures__';
import ClaimRewardsForm from './index';

const mockEstimateFeeResponse = {
  data: {
    transaction: {
      fee: {
        tokenID: '0400000000000000',
        minimum: '5104000',
      },
    },
  },
  meta: {
    breakdown: {
      fee: {
        minimum: {
          byteFee: '96000',
          additionalFees: {},
        },
      },
    },
  },
};

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
jest.mock('@transaction/hooks/queries/useTransactionEstimateFees');
jest.mock('@settings/hooks/useSettings');
jest.mock('@auth/hooks/queries/useAuth');
jest.mock('@token/fungible/hooks/queries/useTokenBalances');
jest.spyOn(transactionApi, 'dryRunTransaction').mockResolvedValue([]);

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
  useTransactionEstimateFees.mockReturnValue({
    data: mockEstimateFeeResponse,
    isFetching: false,
    isFetched: true,
    error: false,
  });
  useAuth.mockReturnValue({ data: mockAuth });
  useSettings.mockReturnValue({
    mainChainNetwork: { name: 'devnet' },
    toggleSetting: jest.fn(),
  });
  useTokenBalances.mockReturnValue({
    data: { data: [{ chainID: '04000000', symbol: 'LSK', availableBalance: 40000000 }] },
  });

  const nextStep = jest.fn();

  const props = {
    nextStep,
  };
  const config = { queryClient: true };

  it('Should display properly', async () => {
    smartRender(ClaimRewardsForm, props, config);
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
    smartRender(ClaimRewardsForm, props, config);
    fireEvent.click(screen.getByRole('button', { name: 'Claim rewards' }));

    await waitFor(() => {
      expect(props.nextStep).toHaveBeenCalled();
    });
  });

  it('should have its confirm button disabled if there no availalbe token balances', async () => {
    jest.clearAllMocks();
    useTokenBalances.mockReturnValue({});

    smartRender(ClaimRewardsForm, props, config);
    fireEvent.click(screen.getByRole('button', { name: 'Claim rewards' }));

    await waitFor(() => {
      expect(props.nextStep).not.toHaveBeenCalled();
    });
  });
});
