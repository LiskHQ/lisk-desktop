import { screen } from '@testing-library/react';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { useTokensBalance } from '@token/fungible/hooks/queries';
import { useBlocks } from '@block/hooks/queries/useBlocks';
import { useDelegates } from '@dpos/validator/hooks/queries';
import { useAuth } from '@auth/hooks/queries';
import { fromRawLsk } from '@token/fungible/utils/lsk';

import { mockBlocks } from '@block/__fixtures__';
import { mockDelegates } from '@dpos/validator/__fixtures__';
import { mockAuth } from '@auth/__fixtures__/mockAuth';
import { mockTokensBalance } from '@token/fungible/__fixtures__/mockTokens';
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
jest.mock('@dpos/validator/hooks/queries');
jest.mock('@auth/hooks/queries');

describe('AllTokens', () => {
  const history = { location: { search: '' } };

  it('should display properly', async () => {
    const props = {
      history,
    };

    useTokensBalance.mockReturnValue({ data: mockTokensBalance, isLoading: false });
    useAuth.mockReturnValue({ data: mockAuth });
    useDelegates.mockReturnValue({ data: mockDelegates });
    useBlocks.mockReturnValue({ data: mockBlocks });

    renderWithRouter(AllTokens, props);

    expect(screen.getByText('Request')).toBeTruthy();
    expect(screen.getByText('Send')).toBeTruthy();
    expect(screen.getByText('All tokens')).toBeTruthy();
    expect(screen.getAllByAltText('arrowRightInactive')).toHaveLength(
      mockTokensBalance.data.length
    );

    tableHeaderMap(jest.fn((t) => t)).forEach(({ title }) => {
      expect(screen.getByText(title)).toBeTruthy();
    });

    mockTokensBalance.data.forEach(({ name, symbol, availableBalance, lockedBalances }, index) => {
      const lockedBalance = lockedBalances.reduce((total, { amount }) => +amount + total, 0);

      expect(screen.getByText(name)).toBeTruthy();
      expect(screen.getByText(fromRawLsk(lockedBalance))).toBeTruthy();
      expect(screen.queryByText(fromRawLsk(availableBalance))).toBeTruthy();
      expect(screen.queryByText(fromRawLsk(+availableBalance + lockedBalance))).toBeTruthy();

      expect(
        screen
          .getAllByTestId('fiat-balance')
          [index].innerHTML.match(
            new RegExp(`~${fromRawLsk(availableBalance)}`.replace('.', '\\.'))
          )
      ).toBeTruthy();
      expect(screen.getByAltText(symbol)).toBeTruthy();
    });
  });
});
