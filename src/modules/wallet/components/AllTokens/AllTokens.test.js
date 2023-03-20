import { fireEvent, screen, waitFor } from '@testing-library/react';
import numeral from 'numeral';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { useTokensBalance } from '@token/fungible/hooks/queries';
import { useBlocks } from '@block/hooks/queries/useBlocks';
import { useValidators } from '@pos/validator/hooks/queries';
import { useAuth } from '@auth/hooks/queries';
import { convertFromBaseDenom } from '@token/fungible/utils/helpers';
import { useFilter } from 'src/modules/common/hooks';

import { mockBlocks } from '@block/__fixtures__';
import { mockValidators } from '@pos/validator/__fixtures__';
import { mockAuth } from '@auth/__fixtures__/mockAuth';
import { mockAppsTokens, mockTokensBalance } from '@token/fungible/__fixtures__/mockTokens';
import { renderWithRouter } from 'src/utils/testHelpers';
import AllTokens from './AllTokens';
import tableHeaderMap from './tableHeaderMap';

const mockedCurrentAccount = mockSavedAccounts[0];

jest.mock('@account/hooks', () => ({
  useCurrentAccount: jest.fn(() => [mockedCurrentAccount, jest.fn()]),
}));

jest.mock('@token/fungible/hooks/queries');
jest.mock('@account/hooks');
jest.mock('@block/hooks/queries/useBlocks');
jest.mock('@pos/validator/hooks/queries');
jest.mock('@auth/hooks/queries');
jest.mock('src/modules/common/hooks');

describe('AllTokens', () => {
  const history = { location: { search: '' } };
  const mergedTokens = mockAppsTokens.data.map((token, index) => ({
    ...mockTokensBalance.data[index],
    ...token,
  }));

  const mergedTokensData = mockTokensBalance.data.map((tokenData, idx) => ({
    ...tokenData,
    ...mockAppsTokens.data[idx],
  }));
  useTokensBalance.mockReturnValue({
    data: { data: mergedTokensData },
    isLoading: false,
    isSuccess: true,
  });
  useAuth.mockReturnValue({ data: mockAuth });
  useValidators.mockReturnValue({ data: mockValidators });
  useBlocks.mockReturnValue({ data: mockBlocks });

  it('should display token details properly', async () => {
    const props = {
      history,
    };

    useFilter.mockReturnValue({ filters: {} });
    renderWithRouter(AllTokens, props);

    expect(screen.getByText('Request')).toBeTruthy();
    expect(screen.getByText('Send')).toBeTruthy();
    expect(screen.getByText('All tokens')).toBeTruthy();

    tableHeaderMap(jest.fn((t) => t)).forEach(({ title }) => {
      expect(screen.getByText(title)).toBeTruthy();
    });

    mergedTokens.forEach(({ chainName, symbol, availableBalance, lockedBalances }) => {
      const lockedBalance = lockedBalances.reduce((total, { amount }) => +amount + total, 0);

      expect(screen.getByText(chainName)).toBeTruthy();
      expect(
        screen.getByText(
          numeral(convertFromBaseDenom(lockedBalance, mockAppsTokens.data[0])).format('0')
        )
      ).toBeTruthy();
      expect(
        screen.queryByText(
          numeral(convertFromBaseDenom(availableBalance, mockAppsTokens.data[0])).format('0,0.00')
        )
      ).toBeTruthy();
      expect(
        screen.queryByText(
          numeral(
            convertFromBaseDenom(+availableBalance + lockedBalance, mockAppsTokens.data[0])
          ).format('0,0.00')
        )
      ).toBeTruthy();
      expect(screen.getByText(/~10\.00/g)).toBeTruthy();
      expect(screen.getByAltText(symbol)).toBeTruthy();
    });
  });

  jest.useFakeTimers();

  it('should display properly', async () => {
    const setFilter = jest.fn();
    const props = {
      history,
    };

    useFilter.mockReturnValue({ filters: {}, setFilter });

    renderWithRouter(AllTokens, props);

    fireEvent.change(screen.getByTestId('search-token'), { target: { value: 'test' } });

    await waitFor(() => {
      expect(setFilter).toHaveBeenCalledWith('search', 'test');
    });
  });
});
