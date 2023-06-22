import React from 'react';
import { MemoryRouter } from 'react-router';
import { render, screen } from '@testing-library/react';
import numeral from 'numeral';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { useTokenBalances } from '@token/fungible/hooks/queries';
import { useValidators } from '@pos/validator/hooks/queries';
import { useAuth } from '@auth/hooks/queries';
import { convertFromBaseDenom } from '@token/fungible/utils/helpers';

import { mockBlocks } from '@block/__fixtures__';
import { mockValidators } from '@pos/validator/__fixtures__';
import { mockAuth } from '@auth/__fixtures__/mockAuth';
import { mockAppsTokens, mockTokensBalance } from '@token/fungible/__fixtures__/mockTokens';
import { useLatestBlock } from '@block/hooks/queries/useLatestBlock';
import { useBlocks } from '@block/hooks/queries/useBlocks';
import FlashMessageHolder from 'src/theme/flashMessage/holder';
import useFiatRates from 'src/modules/common/hooks/useFiatRates';
import Overview from './overview';

const mockedCurrentAccount = mockSavedAccounts[0];

jest.mock('@account/hooks', () => ({
  useCurrentAccount: jest.fn(() => [mockedCurrentAccount, jest.fn()]),
}));

jest.mock('@token/fungible/hooks/queries');
jest.mock('@account/hooks');
jest.mock('@pos/validator/hooks/queries', () => ({
  useValidators: jest.fn(),
}));
jest.mock('@auth/hooks/queries');
jest.mock('@block/hooks/queries/useBlocks');
jest.mock('@block/hooks/queries/useLatestBlock');
jest.mock('src/modules/common/hooks/useFiatRates');

describe('Overview', () => {
  const history = { location: { search: '' } };

  const mergedTokens = mockAppsTokens.data.map((token, index) => ({
    ...mockTokensBalance.data[index],
    ...token,
  }));

  useFiatRates.mockReturnValue({ LSK: { USD: 1, EUR: 1 } });

  it('should display properly', async () => {
    const props = {
      history,
    };

    const mergedTokensData = mockTokensBalance.data.map((tokenData, idx) => ({
      ...tokenData,
      ...mockAppsTokens.data[idx],
    }));
    useTokenBalances.mockReturnValue({
      data: { data: mergedTokensData },
      isLoading: false,
      isSuccess: true,
    });
    useAuth.mockReturnValue({ data: mockAuth });
    useValidators.mockReturnValue({ data: mockValidators });
    useBlocks.mockReturnValue({ data: mockBlocks });
    useLatestBlock.mockReturnValue({ data: mockBlocks.data[0] });

    render(
      <MemoryRouter>
        <FlashMessageHolder />
        <Overview {...props} />
      </MemoryRouter>
    );

    expect(screen.getByText('Request')).toBeTruthy();
    expect(screen.getByText('Send')).toBeTruthy();
    expect(screen.getByText('Tokens')).toBeTruthy();
    expect(screen.getByText(mockAuth.meta.address)).toBeTruthy();
    expect(screen.getByText(mockValidators.data[0].name)).toBeTruthy();
    expect(screen.getByText('View all tokens')).toBeTruthy();

    expect(screen.getAllByTestId('token-card')).toHaveLength(mergedTokens.length);

    mergedTokens.forEach(({ symbol, availableBalance, lockedBalances }) => {
      const lockedBalance = lockedBalances.reduce((total, { amount }) => +amount + total, 0);

      expect(
        screen.queryByText(
          `${numeral(convertFromBaseDenom(lockedBalance, mockAppsTokens.data[0])).format(
            '0'
          )} ${symbol.toUpperCase()}`
        )
      );
      expect(
        screen.queryByText(
          `${numeral(convertFromBaseDenom(availableBalance, mockAppsTokens.data[0])).format(
            '0,0.00'
          )}`
        )
      );
      expect(
        screen.queryByText(
          `${numeral(
            convertFromBaseDenom(+availableBalance + lockedBalance, mockAppsTokens.data[0])
          ).format('0,0.00')}`
        )
      );
      expect(screen.getByAltText(symbol)).toBeTruthy();
    });
  });
});
