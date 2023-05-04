import { createEvent, fireEvent, screen, waitFor } from '@testing-library/react';
import mockSavedAccounts from '@tests/fixtures/accounts';
import * as reactRedux from 'react-redux';
import { renderWithCustomRouter } from 'src/utils/testHelpers';
import AddAccountBySecretRecovery from './AddAccountBySecretRecovery';

const recoveryPhrase =
  'target cancel solution recipe vague faint bomb convince pink vendor fresh patrol';
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
      recoveryPhrase,
    }),
  }),
}));

reactRedux.useSelector = jest.fn().mockReturnValue(mockSavedAccounts[0]);

const props = {
  history: { push: jest.fn() },
  login: jest.fn(),
};

beforeEach(() => {
  renderWithCustomRouter(AddAccountBySecretRecovery, props);
});

describe('Add account by secret recovery phrase flow', () => {
  it('Should successfully go though the flow', async () => {
    expect(screen.getByText('Add your account')).toBeTruthy();
    expect(
      screen.getByText('Enter your secret recovery phrase to manage your account.')
    ).toBeTruthy();
    expect(screen.getByText('Continue to set password')).toBeTruthy();
    expect(screen.getByText('Go back')).toBeTruthy();

    const inputField = screen.getByTestId('recovery-1');
    const pasteEvent = createEvent.paste(inputField, {
      clipboardData: {
        getData: () =>
          'below record evolve eye youth post control consider spice swamp hidden easily',
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
      expect(screen.getByText("Perfect! You're all set")).toBeTruthy();
      expect(
        screen.getByText(
          'You can now download your encrypted secret recovery phrase and use it to add your account on other devices.'
        )
      ).toBeTruthy();
      expect(screen.getByText('Download')).toBeTruthy();

      fireEvent.click(screen.getByText('Continue to wallet'));

      expect(props.history.push).toBeCalled();
    });
  });
});
