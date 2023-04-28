import { fireEvent, screen, waitFor } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import { renderWithRouter } from 'src/utils/testHelpers';
import { useCurrentAccount } from '@account/hooks/useCurrentAccount';
import mockSavedAccounts from '@tests/fixtures/accounts';
import wallets from '@tests/constants/wallets';
import BackupRecoveryPhraseFlow from './BackupRecoveryPhraseFlow';

const recoveryPhrase =
  'target cancel solution recipe vague faint bomb convince pink vendor fresh patrol';

jest.mock('@account/hooks/useAccounts', () => ({
  useAccounts: jest.fn(() => ({
    accounts: [mockSavedAccounts],
    getAccountByAddress: jest.fn().mockReturnValue(mockSavedAccounts[0]),
  })),
}));

jest.mock('@account/utils/encryptAccount', () => ({
  decryptAccount: jest.fn().mockResolvedValue({
    error: null,
    result: {
      privateKey: '',
      recoveryPhrase,
    },
  }),
}));

jest.mock('@account/hooks/useCurrentAccount');

reactRedux.useSelector = jest.fn().mockReturnValue(wallets.genesis);

const props = {
  history: { push: jest.fn() },
};

describe('Backup account recovery phrase flow', () => {
  useCurrentAccount.mockReturnValue([mockSavedAccounts[0]]);

  it('Should successfully go though the flow', async () => {
    renderWithRouter(BackupRecoveryPhraseFlow, props);
    expect(screen.getByText('Enter your account password')).toBeTruthy();
    expect(
      screen.getByText('Please enter your account password to backup the secret recovery phrase.')
    ).toBeTruthy();
    expect(screen.getByTestId('password')).toBeTruthy();
    expect(screen.getByText('Continue')).toBeTruthy();

    const passwordField = screen.getByTestId('password');
    fireEvent.change(passwordField, { target: { value: 't3stP@ssw0rD' } });
    fireEvent.click(screen.getByText('Continue'));

    await waitFor(() => {
      expect(screen.getByText('Backup your secret recovery phrase')).toBeTruthy();
      expect(
        screen.getByText('Keep it safe as it is the only way to access your wallet.')
      ).toBeTruthy();
      expect(
        screen.getByText(
          'Please write down these seed values carefully. Ensure that you keep this in a safe place, with access to the seed you can re-create the account.'
        )
      ).toBeTruthy();
      expect(screen.getByText('Copy')).toBeTruthy();
      expect(screen.getByText('I have written them down')).toBeTruthy();
      expect(screen.getByText('Go back')).toBeTruthy();

      fireEvent.click(screen.getByText('I have written them down'));
    });

    expect(screen.getByText('Confirm your secret recovery phrase')).toBeTruthy();
    expect(
      screen.getByText(
        'Please choose the correct words from the list below to complete your secret recovery phrase.'
      )
    ).toBeTruthy();
    expect(screen.getByText('Secret recovery phrase')).toBeTruthy();
    expect(screen.getByText('Confirm')).toBeTruthy();
    expect(screen.getByText('Go back')).toBeTruthy();

    fireEvent.click(screen.getByText('solution'));
    fireEvent.click(screen.getByText('vendor'));
    fireEvent.click(screen.getByText('Confirm'));

    await waitFor(() => {
      expect(screen.getByText("Perfect! You're all set")).toBeTruthy();
      expect(
        screen.getByText(
          'You can now download your encrypted secret recovery phrase and use it to add your account on other devices.'
        )
      ).toBeTruthy();
      expect(screen.getByText('Download')).toBeTruthy();

      fireEvent.click(screen.getByText('Continue to wallet'));
    });
  });
});
