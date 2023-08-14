import { cryptography } from '@liskhq/lisk-client';
import { createEvent, fireEvent, screen, waitFor } from '@testing-library/react';
import { smartRender } from 'src/utils/testHelpers';
import mockSavedAccounts from '@tests/fixtures/accounts';
import * as reactRedux from 'react-redux';
import wallets from '@tests/constants/wallets';
import AddAccountByFile from './AddAccountByFile';

const mockOnPostMessage = jest.fn();
const mockOnTerminate = jest.fn();
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

const mockHistory = {
  location: {
    pathname: '',
  },
  push: jest.fn(),
  goBack: jest.fn(),
};
const recoveryPhrase =
  'target cancel solution recipe vague faint bomb convince pink vendor fresh patrol';

jest.mock('react-i18next');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => mockHistory,
  useLocation: jest.fn().mockReturnValue({ search: '/' }),
}));

jest.mock('@account/hooks', () => ({
  useAccounts: jest.fn(() => ({
    accounts: mockSavedAccounts,
    getAccountByAddress: jest.fn().mockReturnValue(mockSavedAccounts[0]),
    setAccount: jest.fn(),
  })),
  useCurrentAccount: jest.fn(() => [mockSavedAccounts[0], jest.fn()]),
}));

reactRedux.useSelector = jest.fn().mockReturnValue(wallets.genesis);
jest.spyOn(cryptography.encrypt, 'decryptMessageWithPassword').mockResolvedValue(
  JSON.stringify({
    recoveryPhrase,
  })
);

beforeAll(() => {
  window.Worker = WorkerMock;
});

beforeEach(() => {
  smartRender(AddAccountByFile, null, { history: mockHistory });
});

describe('Add account by file flow', () => {
  it('Should successfully go though the flow', async () => {
    expect(screen.getByText('Add your account')).toBeTruthy();
    expect(screen.getByText('Restore your encrypted secret recovery phrase.')).toBeTruthy();
    expect(screen.getByText('Continue')).toBeTruthy();
    expect(screen.getByText('Go back')).toBeTruthy();

    const inputField = screen.getByTestId('tx-sign-input');
    const pasteEvent = createEvent.paste(inputField, {
      clipboardData: {
        getData: () => JSON.stringify(mockSavedAccounts[0]),
      },
    });

    fireEvent(inputField, pasteEvent);
    fireEvent.click(screen.getByText('Continue'));

    expect(screen.getByText('Enter your account password')).toBeTruthy();
    expect(
      screen.getByText('Please enter your account password to backup the secret recovery phrase.')
    ).toBeTruthy();
    expect(screen.getByText(mockSavedAccounts[0].metadata.name)).toBeTruthy();
    expect(screen.getByText(mockSavedAccounts[0].metadata.address)).toBeTruthy();

    const password = screen.getByTestId('password');
    fireEvent.change(password, { target: { value: 'Password1$' } });
    fireEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      expect(screen.getByText("Perfect! You're all set")).toBeTruthy();
      fireEvent.click(screen.getByText('Continue to wallet'));
      expect(mockHistory.push).toBeCalled();
    });
  });
});
