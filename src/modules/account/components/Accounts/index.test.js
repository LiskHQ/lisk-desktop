import { screen } from '@testing-library/react';
import {
  useTokenBalances,
  useTokensBalanceTop,
  useTokenSummary,
} from '@token/fungible/hooks/queries';
import { mockAppsTokens, mockTokenBalancesTop } from '@token/fungible/__fixtures__';
import { renderWithQueryClient } from 'src/utils/testHelpers';
import WalletsMonitor from './Accounts';

jest.mock('@token/fungible/hooks/queries/useTokenBalances');
jest.mock('@token/fungible/hooks/queries/useTokensBalanceTop');
jest.mock('@token/fungible/hooks/queries/useTokenSummary');

describe('Top Accounts Monitor Page', () => {
  beforeEach(() => {
    renderWithQueryClient(WalletsMonitor);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  useTokenBalances.mockReturnValue({ data: mockAppsTokens });
  useTokensBalanceTop.mockReturnValue({
    isLoading: false,
    isSuccess: true,
    data: {
      data: {
        '0000000100000000': mockTokenBalancesTop.data,
      },
    },
  });
  useTokenSummary.mockReturnValue({
    data: {
      data: { totalSupply: [{ tokenID: '0000000100000000', amount: '11043784297530566' }] },
    },
  });

  it('renders a page with header', () => {
    expect(screen.getByText('All accounts')).toBeInTheDocument();
  });

  it('renders table with accounts', () => {
    expect(screen.getByText('Top Account from Testnet')).toBeInTheDocument();
  });
});
