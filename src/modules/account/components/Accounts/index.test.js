import { screen, waitFor } from '@testing-library/react';
import { renderWithQueryClient } from 'src/utils/testHelpers';
import WalletsMonitor from './Accounts';

describe('Top Accounts Monitor Page', () => {
  beforeEach(() => {
    renderWithQueryClient(WalletsMonitor);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

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
