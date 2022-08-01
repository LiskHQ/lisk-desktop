import {
  screen, fireEvent, waitFor,
} from '@testing-library/react';
import { renderWithRouter } from 'src/utils/testHelpers';
import mockSavedAccounts from '@tests/fixtures/accounts';
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
  useCurrentAccount: jest.fn(() => (
    [mockSavedAccounts[0], mockSetAccount]
  )),
}));

describe('Remove account', () => {
  let props;

  beforeEach(() => {
    props = {
      address: mockSavedAccounts[0].metadata.address,
      history: {
        push: jest.fn(),
      },
    };
    renderWithRouter(RemoveAccount, props);
  });

  it('Should successfully go though the flow', async () => {
    expect(screen.getByText('Remove Account?')).toBeTruthy();
    expect(screen.getByText('This account will no longer be stored on this device. You can backup your secret recovery phrase before you remove it.')).toBeTruthy();
    expect(screen.getByText('encrypted_secret_recovery_phrase.json')).toBeTruthy();
    expect(screen.getByText('Download')).toBeTruthy();
    expect(screen.getByText('Cancel')).toBeTruthy();
    expect(screen.getByText('Remove now')).toBeTruthy();

    fireEvent.click(screen.getByText('Remove now'));

    await waitFor(() => {
      expect(screen.getByText('Account was removed')).toBeTruthy();
      expect(screen.getByTestId('accountRemovedIcon')).toBeTruthy();
      expect(screen.getByText('Continue to Manage Accounts')).toBeTruthy();

      fireEvent.click(screen.getByText('Continue to Manage Accounts'));
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
