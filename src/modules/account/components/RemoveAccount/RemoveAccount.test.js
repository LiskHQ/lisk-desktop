import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithRouter } from 'src/utils/testHelpers';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { truncateAddress } from '@wallet/utils/account';
import RemoveAccount from './RemoveAccount';

const mockSetAccount = jest.fn();
const mockDeleteAccount = jest.fn();
jest.mock('react-i18next');
jest.mock('@account/hooks', () => ({
  useAccounts: jest.fn(() => ({
    accounts: mockSavedAccounts,
    getAccountByAddress: jest.fn().mockReturnValue(mockSavedAccounts[0]),
    deleteAccountByAddress: mockDeleteAccount,
  })),
  useCurrentAccount: jest.fn(() => [mockSavedAccounts[0], mockSetAccount]),
}));

describe('Remove account', () => {
  let props;

  beforeEach(() => {
    props = {
      account: mockSavedAccounts[0],
      history: {
        push: jest.fn(),
      },
    };
    renderWithRouter(RemoveAccount, props);
  });

  it('Should successfully go though the flow', async () => {
    const { address, name } = mockSavedAccounts[0].metadata;
    const fileName = `${truncateAddress(address)}_${name}_lisk_account`;
    expect(screen.getByText('Remove Account?')).toBeTruthy();
    const message = 'This account will no longer be stored on this device.{{text}}';
    expect(screen.getByText(message)).toBeTruthy();
    expect(screen.getByText(`${fileName}.json`)).toBeTruthy();
    expect(screen.getByText('Download')).toBeTruthy();
    expect(screen.getByText('Cancel')).toBeTruthy();
    expect(screen.getByText('Remove now')).toBeTruthy();

    fireEvent.click(screen.getByText('Remove now'));

    await waitFor(() => {
      expect(screen.getByText('Account was removed')).toBeTruthy();
      expect(screen.getByTestId('accountRemovedIcon')).toBeTruthy();
      expect(screen.getByText('Continue to manage accounts')).toBeTruthy();

      fireEvent.click(screen.getByText('Continue to manage accounts'));
    });
  });

  it('Should trigger the removeAccount callback', async () => {
    fireEvent.click(screen.getByText('Remove now'));
    await waitFor(() => {
      expect(mockDeleteAccount).toHaveBeenCalled();
      expect(screen.getByText('Account was removed')).toBeTruthy();
    });
  });
});
