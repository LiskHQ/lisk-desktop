import { screen, fireEvent } from '@testing-library/react';
import { renderWithRouterAndQueryClient } from 'src/utils/testHelpers';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { truncateAddress, truncateAccountName } from '@wallet/utils/account';
import { mockHWAccounts } from '@hardwareWallet/__fixtures__';
import { mockAppsTokens } from '@token/fungible/__fixtures__';
import { useTokenBalances } from '@token/fungible/hooks/queries';
import AccountManagementDropdown from './AccountManagementDropdown';

const mockCurrentAccount = mockSavedAccounts[0];
const mockOnMenuClick = jest.fn();
jest.mock('../../../account/hooks/useCurrentAccount.js', () => ({
  useCurrentAccount: jest.fn(() => [mockCurrentAccount]),
}));

jest.mock('@token/fungible/hooks/queries/useTokenBalances');

describe('AccountManagementDropdown', () => {
  useTokenBalances.mockReturnValue({
    data: {
      data: [{ name: 'Lisk', symbol: 'LSK', availableBalance: 0, ...mockAppsTokens.data[0] }],
    },
  });

  it('displays properly', () => {
    const props = {
      currentAccount: mockCurrentAccount,
      onMenuClick: mockOnMenuClick,
    };
    renderWithRouterAndQueryClient(AccountManagementDropdown, props);
    expect(screen.getByText(mockCurrentAccount.metadata.name)).toBeInTheDocument();
    expect(
      screen.getByText(truncateAddress(mockCurrentAccount.metadata.address))
    ).toBeInTheDocument();
    fireEvent.click(screen.getByAltText('dropdownArrowIcon'));
    expect(mockOnMenuClick).toHaveBeenCalledTimes(2);
    expect(screen.getByText('Edit account name')).toBeInTheDocument();
    expect(screen.getByText('Switch account')).toBeInTheDocument();
    expect(screen.getByText('Backup account')).toBeInTheDocument();
    expect(screen.getByText('Add new account')).toBeInTheDocument();
    expect(screen.getByText('Register multisignature account')).toBeInTheDocument();
    expect(screen.getByText('Remove account')).toBeInTheDocument();
  });

  it('truncates account name if necessary', () => {
    const mockUpdatedCurrentAccount = {
      ...mockCurrentAccount,
      metadata: { ...mockCurrentAccount.metadata, name: 'very_long_account' },
    };
    const props = {
      currentAccount: mockUpdatedCurrentAccount,
      onMenuClick: mockOnMenuClick,
    };
    renderWithRouterAndQueryClient(AccountManagementDropdown, props);
    expect(
      screen.getByText(truncateAccountName(mockUpdatedCurrentAccount.metadata.name))
    ).toBeInTheDocument();
  });

  it('Should display hw icon when current account is a hardware wallet account', () => {
    const props = {
      currentAccount: mockHWAccounts[0],
      onMenuClick: mockOnMenuClick,
    };
    renderWithRouterAndQueryClient(AccountManagementDropdown, props);
    expect(screen.getByAltText('hardwareWalletIcon')).toBeTruthy();
  });

  it('Should dismiss menu when item is clicked', () => {
    const props = {
      currentAccount: mockHWAccounts[0],
      onMenuClick: mockOnMenuClick,
    };
    renderWithRouterAndQueryClient(AccountManagementDropdown, props);
    fireEvent.click(screen.getByAltText('dropdownArrowIcon'));
    fireEvent.click(screen.getByText('Backup account'));
    expect(screen.getByText('Register multisignature account')).toBeVisible();
  });
});
