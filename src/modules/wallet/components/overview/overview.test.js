import React from 'react';
import { render, screen } from '@testing-library/react';
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
import Overview from './overview';
import { renderWithRouter } from 'src/utils/testHelpers';
import FlashMessageHolder from 'src/theme/flashMessage/holder';
import { MemoryRouter } from 'react-router';

const mockedCurrentAccount = mockSavedAccounts[0];

// jest.mock('react-i18next', () => ({
//   ...jest.requireActual('react-i18next'),
//   useTranslation: jest.fn().mockReturnValue({ t: jest.fn((val) => val) }),
// }));
jest.mock('@account/hooks', () => ({
  useCurrentAccount: jest.fn(() => [mockedCurrentAccount, jest.fn()]),
}));

jest.mock('@token/fungible/hooks/queries');
jest.mock('@account/hooks');
jest.mock('@block/hooks/queries/useBlocks');
jest.mock('@dpos/validator/hooks/queries');
jest.mock('@auth/hooks/queries');

describe('Overview', () => {
  let wrapper;
  const history = { location: { search: '' } };

  it('should display properly', async () => {
    const props = {
      history,
    };

    useTokensBalance.mockReturnValue({ data: mockTokensBalance, isLoading: false });
    useAuth.mockReturnValue({ data: mockAuth });
    useDelegates.mockReturnValue({ data: mockDelegates });
    useBlocks.mockReturnValue({ data: mockBlocks });

    wrapper = render(
      <MemoryRouter>
        <FlashMessageHolder />
        <Overview {...props} />
      </MemoryRouter>
    );

    expect(screen.getByText('Request')).toBeTruthy();
    expect(screen.getByText('Send')).toBeTruthy();
    expect(screen.getByText('Tokens')).toBeTruthy();
    expect(screen.getByText(mockAuth.meta.address)).toBeTruthy();
    expect(screen.getByText(mockAuth.meta.name)).toBeTruthy();
    expect(screen.getByText('View all tokens')).toBeTruthy();

    expect(screen.getAllByTestId('token-card')).toHaveLength(mockTokensBalance.data.length);

    mockTokensBalance.data.forEach(({ symbol, availableBalance, lockedBalances }) => {
      const lockedBalance = lockedBalances.reduce((total, { amount }) => +amount + total, 0);

      expect(screen.queryByText(`${fromRawLsk(lockedBalance)} ${symbol.toUpperCase()}`));
      expect(screen.queryByText(`${fromRawLsk(availableBalance)}`));
      expect(screen.queryByText(`${fromRawLsk(+availableBalance + lockedBalance)}`));
      expect(screen.getByAltText(symbol)).toBeTruthy();
    });
  });
});
