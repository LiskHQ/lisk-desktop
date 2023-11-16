import { fireEvent, screen } from '@testing-library/react';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { useTokenBalances } from '@token/fungible/hooks/queries';
import { convertFromBaseDenom } from '@token/fungible/utils/helpers';
import { getMockValidators, mockSentStakes, mockUnlocks } from '@pos/validator/__fixtures__';
import { mockTokensBalance } from '@token/fungible/__fixtures__/mockTokens';
import { truncateAddress } from '@wallet/utils/account';
import { renderWithRouterAndQueryClient } from 'src/utils/testHelpers';
import { useRewardsClaimable } from '@pos/reward/hooks/queries';
import { mockRewardsClaimable } from '@pos/reward/__fixtures__';
import { mockAppsTokens } from '@token/fungible/__fixtures__';
import usePosToken from '@pos/validator/hooks/usePosToken';
import routes from 'src/routes/routes';
import { mockTransactions } from '@transaction/__fixtures__';
import * as useMyTransactionsSpy from '@transaction/hooks/queries/useMyTransactions';
import SentStakes from './SentStakes';
import tableHeaderMap from './tableHeaderMap';
import { usePosConstants, useSentStakes, useUnlocks, useValidators } from '../../hooks/queries';
import { mockPosConstants } from '../../__fixtures__/mockPosConstants';

const mockedCurrentAccount = mockSavedAccounts[0];

jest.mock('@account/hooks', () => ({
  useCurrentAccount: jest.fn(() => [mockedCurrentAccount, jest.fn()]),
}));

jest.mock('@token/fungible/hooks/queries/useTokenBalances');
jest.mock('@pos/reward/hooks/queries/useRewardsClaimable');
jest.mock('../../hooks/queries');
jest.mock('@pos/validator/hooks/usePosToken');
const mockRefetchSentStakes = jest.fn();

describe('SentStakes', () => {
  const historyPush = jest.fn();
  const props = {
    history: { location: { search: '' }, push: historyPush },
  };

  useRewardsClaimable.mockReturnValue({ data: mockRewardsClaimable });
  usePosToken.mockReturnValue({ token: mockAppsTokens.data[0] });
  useTokenBalances.mockReturnValue({ data: mockAppsTokens });

  useValidators.mockImplementation(({ config }) => ({
    data: getMockValidators(config.params?.address),
  }));
  useSentStakes.mockReturnValue({ data: mockSentStakes, refetch: mockRefetchSentStakes });
  useUnlocks.mockReturnValue({ data: mockUnlocks, refetch: jest.fn() });
  usePosConstants.mockReturnValue({ data: mockPosConstants });

  it('should display properly', async () => {
    renderWithRouterAndQueryClient(SentStakes, props);

    expect(screen.getByText('Stakes')).toBeTruthy();
    expect(screen.getByText(10 - mockSentStakes.meta.count)).toBeTruthy();
    expect(screen.getAllByAltText('stakingQueueActive')).toBeTruthy();

    tableHeaderMap(jest.fn((t) => t)).forEach(({ title }) => {
      expect(screen.getByText(title)).toBeTruthy();
    });

    mockSentStakes.data.stakes.forEach(({ address, amount, name }, index) => {
      expect(screen.getAllByText(name)[0]).toBeTruthy();
      expect(screen.getByText(truncateAddress(address))).toBeTruthy();
      expect(
        screen.getAllByText(
          `${convertFromBaseDenom(amount, mockAppsTokens.data[0])} ${
            mockTokensBalance.data[0].symbol
          }`
        )[0]
      ).toBeTruthy();
      expect(screen.getAllByAltText('edit')[index]).toBeTruthy();
    });
  });

  it('should not display staking and token', async () => {
    useSentStakes.mockReturnValue({});
    useTokenBalances.mockReturnValue({});

    renderWithRouterAndQueryClient(SentStakes, props);

    mockSentStakes.data.stakes.forEach(({ address, amount, name }, index) => {
      expect(screen.queryAllByText(name)[0]).toBeFalsy();
      expect(screen.queryByText(truncateAddress(address))).toBeFalsy();
      expect(
        screen.queryAllByText(`${convertFromBaseDenom(amount, mockAppsTokens.data[0])}`)[0]
      ).toBeFalsy();
      expect(screen.queryAllByAltText('edit')[index]).toBeFalsy();
    });
  });

  it('should navigate to /validators when arrow left is clicked', async () => {
    renderWithRouterAndQueryClient(SentStakes, props);
    fireEvent.click(screen.getByAltText('arrowLeftTailed'));
    expect(historyPush).toHaveBeenCalledWith(routes.validators.path);
  });

  it('should refetch sentStakes when new transaction occurs', async () => {
    jest.spyOn(useMyTransactionsSpy, 'useMyTransactions').mockReturnValue({
      data: {
        meta: {
          total: 2,
        },
        data: mockTransactions.data.slice(0, 2),
      },
    });
    useSentStakes.mockReturnValue({ data: mockSentStakes, refetch: mockRefetchSentStakes });
    renderWithRouterAndQueryClient(SentStakes, props);
    expect(mockRefetchSentStakes).toHaveBeenCalledTimes(1);
  });

  it('displays no notification if there are no claimable rewards', () => {
    useRewardsClaimable.mockReturnValue({ data: {} });
    renderWithRouterAndQueryClient(SentStakes, props);
    expect(screen.queryByTestId('notification')).not.toBeInTheDocument();
  });
});
