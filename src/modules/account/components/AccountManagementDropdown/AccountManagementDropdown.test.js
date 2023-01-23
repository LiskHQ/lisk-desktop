import { screen, fireEvent } from '@testing-library/react';
import { renderWithRouterAndQueryClient } from 'src/utils/testHelpers';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { truncateAddress } from '@wallet/utils/account';
import AccountManagementDropdown from './AccountManagementDropdown';

const mockCurrentAccount = mockSavedAccounts[0];
const mockOnMenuClick = jest.fn();
jest.mock('../../../account/hooks/useCurrentAccount.js', () => ({
  useCurrentAccount: jest.fn(() => [mockCurrentAccount]),
}));

describe('AccountManagementDropdown', () => {
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
    expect(mockOnMenuClick).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Edit account name')).toBeInTheDocument();
    expect(screen.getByText('Switch account')).toBeInTheDocument();
    expect(screen.getByText('Backup account')).toBeInTheDocument();
    expect(screen.getByText('Add new account')).toBeInTheDocument();
    expect(screen.getByText('Register multisignature account')).toBeInTheDocument();
    expect(screen.getByText('Remove account')).toBeInTheDocument();
  });
});
