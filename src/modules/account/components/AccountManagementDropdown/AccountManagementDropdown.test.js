import { screen, fireEvent } from '@testing-library/react';
import { renderWithRouter } from 'src/utils/testHelpers';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { truncateAddress } from '@wallet/utils/account';
import AccountManagementDropdown from './AccountManagementDropdown';

const mockCurrentAccount = mockSavedAccounts[0];
jest.mock('../../../account/hooks/useCurrentAccount.js', () => ({
  useCurrentAccount: jest.fn(() => [mockCurrentAccount]),
}));

describe('AccountManagementDropdown', () => {
  it('displays properly', () => {
    const props = {
      currentAccount: mockCurrentAccount,
    };
    renderWithRouter(AccountManagementDropdown, props);
    expect(screen.getByText('my lisk account')).toBeInTheDocument();
    expect(
      screen.getByText(truncateAddress(mockCurrentAccount.metadata.address))
    ).toBeInTheDocument();
    fireEvent.click(screen.getByAltText('dropdownArrowIcon'));
    expect(screen.getByText('Edit name')).toBeInTheDocument();
    expect(screen.getByText('Switch account')).toBeInTheDocument();
    expect(screen.getByText('Backup account')).toBeInTheDocument();
    expect(screen.getByText('Add new account')).toBeInTheDocument();
    expect(screen.getByText('Upgrade to multisignature')).toBeInTheDocument();
    expect(screen.getByText('Remove account')).toBeInTheDocument();
  });
});
