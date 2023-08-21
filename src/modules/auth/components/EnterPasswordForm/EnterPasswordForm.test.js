/* eslint-disable max-classes-per-file */
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import mockSavedAccounts from '@tests/fixtures/accounts';
import accounts from '@tests/constants/wallets';
import EnterPasswordForm from '.';

const mockedCurrentAccount = mockSavedAccounts[0];
const mockOnPostMessage = jest.fn();
const mockOnTerminate = jest.fn();
const recoveryPhrase =
  'target cancel solution recipe vague faint bomb convince pink vendor fresh patrol';

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
        privateKey: accounts.genesis.summary.privateKey,
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

jest.mock('@account/utils/encryptAccount');
jest.mock('@account/hooks', () => ({
  useCurrentAccount: jest.fn(() => [mockedCurrentAccount, jest.fn()]),
  useAccounts: jest.fn(() => ({
    getAccountByAddress: jest.fn(() => mockedCurrentAccount),
  })),
}));

beforeAll(() => {
  window.Worker = WorkerMock;
});

describe('EnterPasswordForm', () => {
  const props = {
    onEnterPasswordSuccess: jest.fn(),
    nextStep: jest.fn(),
  };
  const accountPassword = 'qwerty';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display properly', () => {
    render(<EnterPasswordForm {...props} />);
    expect(screen.queryByText(mockedCurrentAccount.metadata.name));
    expect(screen.queryByText(mockedCurrentAccount.metadata.address));
  });

  it('should render with any given encryptedAccount', async () => {
    const encryptedAccount = {
      ...mockedCurrentAccount,
      metadata: {
        ...mockedCurrentAccount.metadata,
        name: 'New account',
      },
    };
    const newProps = {
      ...props,
      encryptedAccount,
    };
    render(<EnterPasswordForm {...newProps} />);
    expect(screen.queryByText('New account'));
    expect(screen.queryByText(mockedCurrentAccount.metadata.address));
  });

  it('should call onEnterPasswordSuccess when onSubmit click', async () => {
    const wrapper = render(<EnterPasswordForm {...props} />);
    props.recoveryPhrase = recoveryPhrase;
    wrapper.rerender(<EnterPasswordForm {...props} />);

    fireEvent.change(screen.getByTestId('password'), { target: { value: accountPassword } });
    fireEvent.click(screen.getByText('Continue'));

    await waitFor(() => {
      expect(props.onEnterPasswordSuccess).toHaveBeenCalledWith({
        recoveryPhrase,
        privateKey: accounts.genesis.summary.privateKey,
        encryptedAccount: mockedCurrentAccount,
      });
    });
  });

  it('should display error', async () => {
    class WorkerMock2 {
      constructor(stringUrl) {
        this.url = stringUrl;
      }

      // eslint-disable-next-line class-methods-use-this
      set onmessage(fn) {
        const data = {
          error: true,
          result: {
            recoveryPhrase:
              'target cancel solution recipe vague faint bomb convince pink vendor fresh patrol',
            privateKey: accounts.genesis.summary.privateKey,
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
    window.Worker = WorkerMock2;

    const wrapper = render(<EnterPasswordForm {...props} />);
    const error = 'Unable to decrypt account. Please check your password';
    wrapper.rerender(<EnterPasswordForm {...props} />);

    fireEvent.change(screen.getByTestId('password'), { target: { value: accountPassword } });
    fireEvent.click(screen.getByText('Continue'));

    await waitFor(() => {
      expect(screen.getByText(error)).toBeTruthy();
      expect(props.onEnterPasswordSuccess).not.toHaveBeenCalled();
    });
  });
});
