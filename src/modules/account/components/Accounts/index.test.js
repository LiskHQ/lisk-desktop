import { screen } from '@testing-library/react';
import {
  useAppsMetaTokens,
  useTokensBalanceTop,
  useTokenSummary,
} from '@token/fungible/hooks/queries';
import { useFees } from '@transaction/hooks/queries';
import { mockAppsTokens, mockTokenBalancesTop } from '@token/fungible/__fixtures__';
import { renderWithQueryClient } from 'src/utils/testHelpers';
import { useFilter } from 'src/modules/common/hooks';
import WalletsMonitor from './Accounts';

jest.mock('@token/fungible/hooks/queries/useAppsMetaTokens');
jest.mock('@transaction/hooks/queries/useFees');
jest.mock('@token/fungible/hooks/queries/useTokensBalanceTop');
jest.mock('@token/fungible/hooks/queries/useTokenSummary');
jest.mock('src/modules/common/hooks/useFilter');

describe('Top Accounts Monitor Page', () => {
  const mockSetFilter = jest.fn();
  beforeEach(() => {
    renderWithQueryClient(WalletsMonitor);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  useAppsMetaTokens.mockReturnValue({ data: mockAppsTokens });
  useTokensBalanceTop.mockReturnValue({
    isLoading: false,
    isSuccess: true,
    data: {
      data: {
        '0000000100000000': mockTokenBalancesTop.data,
      },
    },
  });
  useFees.mockReturnValue({ data: { data: { feeTokenID: '0000000100000000' } } });
  useTokenSummary.mockReturnValue({
    data: {
      data: { totalSupply: [{ tokenID: '0000000100000000', amount: '11043784297530566' }] },
    },
  });
  useFilter.mockReturnValue({ filters: { tokenID: '0000000100000000' }, setFilter: mockSetFilter });

  it('renders a page with header', () => {
    expect(screen.getByText('All accounts')).toBeInTheDocument();
  });

  it('renders table with accounts', () => {
    expect(screen.getByText('Top Account from Testnet')).toBeInTheDocument();
  });
});
