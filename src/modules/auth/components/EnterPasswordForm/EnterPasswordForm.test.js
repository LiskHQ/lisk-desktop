import React from 'react';
import {
  fireEvent, render, screen, waitFor,
} from '@testing-library/react';
import { mockAccount } from 'src/modules/account/utils';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { decryptAccount } from '@account/utils/decryptAccount';
import EnterPasswordForm from '.';

const mockedCurrentAccount = mockSavedAccounts[0];

jest.mock('@account/utils/decryptAccount');
jest.mock('@account/hooks', () => ({
  useCurrentAccount: jest.fn(() => (
    [mockedCurrentAccount, jest.fn()]
  )),
}));

describe('EnterPasswordForm', () => {
  let wrapper;
  const props = {
    onEnterPasswordSuccess: jest.fn(),
    nextStep: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = render(<EnterPasswordForm {...props} />);
  });

  it('should display properly', () => {
    expect(screen.queryByText(mockAccount.metadata.name));
    expect(screen.queryByText(mockAccount.metadata.address));
  });

  it('should call onEnterPasswordSuccess when onSubmit click', async () => {
    const privateKey = 'private-token-mock';
    const password = 'test-password';
    const recoveryPhrase = 'target cancel solution recipe vague faint bomb convince pink vendor fresh patrol';
    decryptAccount.mockImplementation(() => (
      {
        privateKey,
        recoveryPhrase,
      }
    ));
    props.recoveryPhrase = recoveryPhrase;
    wrapper.rerender(<EnterPasswordForm {...props} />);

    fireEvent.change(screen.getByTestId('password'), { target: { value: password } });
    fireEvent.click(screen.getByText('Continue'));

    await waitFor(() => {
      expect(decryptAccount).toHaveBeenCalledWith(
        mockedCurrentAccount,
        password,
      );
      expect(props.onEnterPasswordSuccess).toHaveBeenCalledWith({
        account: { privateKey, recoveryPhrase },
        encryptedPhrase: mockedCurrentAccount,
        recoveryPhrase,
      });
    });
  });

  it('should display error', async () => {
    const error = 'Unable to decrypt account. Please check your password';
    decryptAccount.mockImplementation(() => (
      {
        error,
      }
    ));
    wrapper.rerender(<EnterPasswordForm {...props} />);

    fireEvent.change(screen.getByTestId('password'), { target: { value: 'qwerty' } });
    fireEvent.click(screen.getByText('Continue'));

    await waitFor(() => {
      expect(screen.getByText(error)).toBeTruthy();
    });
  });

  it('should not call onEnterPasswordSuccess when onSubmit fails', async () => {
    decryptAccount.mockImplementation(() => (
      {
        error: 'Unable to decrypt account. Please check your password',
      }
    ));

    fireEvent.change(screen.getByTestId('password'), { target: { value: 'qwerty' } });
    fireEvent.click(screen.getByText('Continue'));

    await waitFor(() => {
      expect(props.onEnterPasswordSuccess).not.toHaveBeenCalled();
      expect(screen.getByText('Unable to decrypt account. Please check your password')).toBeTruthy();
    });
  });
});
