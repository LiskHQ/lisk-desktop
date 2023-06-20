import { screen } from '@testing-library/react';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { useTokenBalances } from '@token/fungible/hooks/queries';
import { convertFromBaseDenom } from '@token/fungible/utils/helpers';
import { getMockValidators, mockSentStakes, mockUnlocks } from '@pos/validator/__fixtures__';
import { mockTokensBalance } from '@token/fungible/__fixtures__/mockTokens';
import { truncateAddress } from '@wallet/utils/account';
import { renderWithRouter } from 'src/utils/testHelpers';
import { useRewardsClaimable } from '@pos/reward/hooks/queries';
import { mockRewardsClaimable } from '@pos/reward/__fixtures__';
import { mockAppsTokens } from '@token/fungible/__fixtures__';
import usePosToken from '@pos/validator/hooks/usePosToken';
import SentStakes from './SentStakes';
import tableHeaderMap from './tableHeaderMap';
import { usePosConstants, useSentStakes, useUnlocks, useValidators } from '../../hooks/queries';
import { mockPosConstants } from '../../__fixtures__/mockPosConstants';

const mockedCurrentAccount = mockSavedAccounts[0];

jest.mock('@account/hooks', () => ({
  useCurrentAccount: jest.fn(() => [mockedCurrentAccount, jest.fn()]),
}));

jest.mock('@token/fungible/hooks/queries');
jest.mock('@pos/reward/hooks/queries');
jest.mock('src/modules/common/hooks');
jest.mock('../../hooks/queries');
jest.mock('@pos/validator/hooks/usePosToken');

describe('SentStakes', () => {
  const props = {
    history: { location: { search: '' } },
  };

  useRewardsClaimable.mockReturnValue({ data: mockRewardsClaimable });
  usePosToken.mockReturnValue({ token: mockAppsTokens.data[0] });

  useValidators.mockImplementation(({ config }) => ({
    data: getMockValidators(config.params?.address),
  }));
  useSentStakes.mockReturnValue({ data: mockSentStakes });
  useUnlocks.mockReturnValue({ data: mockUnlocks });
  usePosConstants.mockReturnValue({ data: mockPosConstants });

  it('should display properly', async () => {
    renderWithRouter(SentStakes, props);

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

    renderWithRouter(SentStakes, props);

    mockSentStakes.data.stakes.forEach(({ address, amount, name }, index) => {
      expect(screen.queryAllByText(name)[0]).toBeFalsy();
      expect(screen.queryByText(truncateAddress(address))).toBeFalsy();
      expect(
        screen.queryAllByText(`${convertFromBaseDenom(amount, mockAppsTokens.data[0])}`)[0]
      ).toBeFalsy();
      expect(screen.queryAllByAltText('edit')[index]).toBeFalsy();
    });
  });
});
