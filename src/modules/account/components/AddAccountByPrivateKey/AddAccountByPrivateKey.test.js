import { createEvent, fireEvent, screen, waitFor } from '@testing-library/react';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { mockOnMessage } from '@setup/config/setupJest';
import * as reactRedux from 'react-redux';
import { renderWithCustomRouter } from 'src/utils/testHelpers';
import AddAccountByPrivateKey from './AddAccountByPrivateKey';

const privateKey =
  'e005805e731d324ec6f083f7ec31967e60cda674cd09f51c323fce63a933e0dadd2df9b2b007bd8a2387f4e652517d6e094cdb54edf0c67b06d4786f5ecf964d';
const accountPassword = 'Password1$';
const userName = 'user1';
const mockSetAccount = jest.fn();

jest.mock('react-i18next');
jest.mock('@account/hooks', () => ({
  useAccounts: jest.fn(() => ({
    accounts: mockSavedAccounts,
    setAccount: jest.fn(),
  })),
  useCurrentAccount: jest.fn(() => [mockSavedAccounts[0], mockSetAccount]),
  useEncryptAccount: jest.fn().mockReturnValue({
    encryptAccount: jest.fn().mockResolvedValue({
      privateKey,
    }),
  }),
}));

reactRedux.useSelector = jest.fn().mockReturnValue(mockSavedAccounts[0]);

const props = {
  history: { push: jest.fn() },
  login: jest.fn(),
};

beforeEach(() => {
  renderWithCustomRouter(AddAccountByPrivateKey, props);
});

describe('Add account by private key flow', () => {
  it('Should successfully go though the flow', async () => {
    expect(screen.getByText('Add your account')).toBeTruthy();
    expect(
      screen.getByText('Enter your private key to manage your account.')
    ).toBeTruthy();
    expect(screen.getByText('Continue to set password')).toBeTruthy();
    expect(screen.getByText('Go back')).toBeTruthy();

    const inputField = screen.getByTestId('recovery-1');
    const pasteEvent = createEvent.paste(inputField, {
      clipboardData: {
        getData: () =>
          'e005805e731d324ec6f083f7ec31967e60cda674cd09f51c323fce63a933e0dadd2df9b2b007bd8a2387f4e652517d6e094cdb54edf0c67b06d4786f5ecf964d',
      },
    });

    fireEvent(inputField, pasteEvent);
    fireEvent.click(screen.getByText('Continue to set password'));

    const password = screen.getByTestId('password');
    const cPassword = screen.getByTestId('cPassword');
    const accountName = screen.getByTestId('accountName');
    const hasAgreed = screen.getByTestId('hasAgreed');

    fireEvent.change(password, { target: { value: accountPassword } });
    fireEvent.change(cPassword, { target: { value: accountPassword } });
    fireEvent.change(accountName, { target: { value: userName } });
    fireEvent.click(hasAgreed);
    fireEvent.click(screen.getByText('Save Account'));

    await waitFor(() => {
      expect(mockOnMessage).toHaveBeenCalledWith({
        accountName: 'user1',
        cPassword: 'Password1$',
        customDerivationPath: "m/44'/134'/0'",
        enableAccessToLegacyAccounts: undefined,
        hasAgreed: true,
        password: 'Password1$',
        privateKey: {
          isValid: true,
          value: 'e005805e731d324ec6f083f7ec31967e60cda674cd09f51c323fce63a933e0dadd2df9b2b007bd8a2387f4e652517d6e094cdb54edf0c67b06d4786f5ecf964d',
        },
      });
    });
  });
});
