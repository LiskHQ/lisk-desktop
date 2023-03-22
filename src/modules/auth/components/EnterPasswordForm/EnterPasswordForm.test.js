import React from 'react';
import {
  fireEvent, render, screen, waitFor,
} from '@testing-library/react';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { decryptAccount } from '@account/utils/encryptAccount';
import EnterPasswordForm from '.';

const mockedCurrentAccount = mockSavedAccounts[0];
const recoveryPhrase = 'target cancel solution recipe vague faint bomb convince pink vendor fresh patrol';

jest.mock('@account/utils/encryptAccount');
jest.mock('@account/hooks', () => ({
  useCurrentAccount: jest.fn(() => (
    [mockedCurrentAccount, jest.fn()]
  )),
  useAccounts: jest.fn(() => ({
    getAccountByAddress: jest.fn(() => mockedCurrentAccount),
  })),
}));

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
      }
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
    const privateKey = 'privateKey';
    decryptAccount.mockImplementation(() => (
      {
        error: null,
        result: {
          privateKey,
          recoveryPhrase,
        },
      }
    ));
    props.recoveryPhrase = recoveryPhrase;
    wrapper.rerender(<EnterPasswordForm {...props} />);

    fireEvent.change(screen.getByTestId('password'), { target: { value: accountPassword } });
    fireEvent.click(screen.getByText('Continue'));

    await waitFor(() => {
      expect(decryptAccount).toHaveBeenCalledWith(
        mockedCurrentAccount.crypto,
        accountPassword,
      );
      expect(props.onEnterPasswordSuccess).toHaveBeenCalledWith({
        recoveryPhrase,
        privateKey,
        encryptedAccount: mockedCurrentAccount,
      });
    });
  });

  it('should display error', async () => {
    const wrapper = render(<EnterPasswordForm {...props} />);
    const error = 'Unable to decrypt account. Please check your password';
    decryptAccount.mockImplementation(() => (
      {
        error,
      }
    ));
    wrapper.rerender(<EnterPasswordForm {...props} />);

    fireEvent.change(screen.getByTestId('password'), { target: { value: accountPassword } });
    fireEvent.click(screen.getByText('Continue'));

    await waitFor(() => {
      expect(screen.getByText(error)).toBeTruthy();
      expect(props.onEnterPasswordSuccess).not.toHaveBeenCalled();
    });
  });
});
