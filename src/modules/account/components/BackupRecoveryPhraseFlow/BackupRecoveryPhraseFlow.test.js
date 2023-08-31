import { fireEvent, screen, waitFor } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import { renderWithRouter } from 'src/utils/testHelpers';
import { useCurrentAccount } from '@account/hooks/useCurrentAccount';
import mockSavedAccounts from '@tests/fixtures/accounts';
import wallets from '@tests/constants/wallets';
import BackupRecoveryPhraseFlow from './BackupRecoveryPhraseFlow';

const mockOnTerminate = jest.fn();
const mockOnPostMessage = jest.fn();
class WorkerMock {
  constructor(stringUrl) {
    this.url = stringUrl;
  }

  // eslint-disable-next-line class-methods-use-this
  set onmessage(fn) {
    const data = {
      error: null,
      result: {
        recoveryPhrase:
          'target cancel solution recipe vague faint bomb convince pink vendor fresh patrol',
        privateKey: wallets.genesis.summary.privateKey,
      },
    };

    fn({ data });
  }

  // eslint-disable-next-line class-methods-use-this
  postMessage(msg) {
    mockOnPostMessage(msg);
  }

  // eslint-disable-next-line class-methods-use-this
  terminate() {
    mockOnTerminate();
  }
}
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

beforeAll(() => {
  window.Worker = WorkerMock;
});

describe('Backup account recovery phrase flow', () => {
  useCurrentAccount.mockReturnValue([mockSavedAccounts[0]]);

  it('Should successfully go though the flow', async () => {
    renderWithRouter(BackupRecoveryPhraseFlow, {});
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
      expect(screen.getByText('Backup account')).toBeTruthy();
      expect(
        screen.getByText('Keep it safe as it is the only way to access your wallet.')
      ).toBeTruthy();
      expect(
        screen.getByText(
          'Writing it down manually offers greater security compared to copying and pasting the recovery phrase.'
        )
      ).toBeTruthy();
      expect(
        screen.getByText(
          'Please write down these 12/24 words carefully, and store them in a safe place.'
        )
      ).toBeTruthy();
      expect(screen.getByText('Copy')).toBeTruthy();
      expect(screen.getByText('Back to wallet')).toBeTruthy();
    });
  });
});
