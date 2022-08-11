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
}));

describe('EnterPasswordForm', () => {
  let wrapper;
  const props = {
    onEnterPasswordSuccess: jest.fn(),
    nextStep: jest.fn(),
  };
  const accountPassword = 'qwerty';

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = render(<EnterPasswordForm {...props} />);
  });

  it('should display properly', () => {
    expect(screen.queryByText(mockedCurrentAccount.metadata.name));
    expect(screen.queryByText(mockedCurrentAccount.metadata.address));
  });

  it('should call onEnterPasswordSuccess when onSubmit click', async () => {
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
        mockedCurrentAccount.encryptedPassphrase,
        accountPassword,
      );
      expect(props.onEnterPasswordSuccess).toHaveBeenCalledWith({
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

    fireEvent.change(screen.getByTestId('password'), { target: { value: accountPassword } });
    fireEvent.click(screen.getByText('Continue'));

    await waitFor(() => {
      expect(screen.getByText(error)).toBeTruthy();
      expect(props.onEnterPasswordSuccess).not.toHaveBeenCalled();
    });
  });
});
