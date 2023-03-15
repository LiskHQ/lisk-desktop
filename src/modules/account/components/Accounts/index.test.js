import { screen, waitFor } from '@testing-library/react';
import { useTokensBalance } from '@token/fungible/hooks/queries';
import { mockAppsTokens } from '@token/fungible/__fixtures__';
import { renderWithQueryClient } from 'src/utils/testHelpers';
import WalletsMonitor from './Accounts';

jest.mock('@token/fungible/hooks/queries/useTokensBalance');

describe('Top Accounts Monitor Page', () => {
  beforeEach(() => {
    renderWithQueryClient(WalletsMonitor);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  useTokensBalance.mockReturnValue({ data: mockAppsTokens });

  it('renders a page with header', () => {
    expect(screen.getByText('All accounts')).toBeInTheDocument();
  });

  it('renders table with accounts', async () => {
    expect(screen.queryByTestId('accounts-row')).not.toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('Top Account from Testnet')).toBeInTheDocument());
    expect(screen.getByText('80,241,837 LSK')).toBeInTheDocument();
    expect(screen.getByText('Oliver Personal Assets')).toBeInTheDocument();
  });
});
