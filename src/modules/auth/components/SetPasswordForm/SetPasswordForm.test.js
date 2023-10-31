import React from 'react';
import { cryptography } from '@liskhq/lisk-client';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { mockOnMessage } from '@setup/config/setupJest';
import mockSavedAccounts from '@tests/fixtures/accounts';
import SetPasswordForm from './SetPasswordForm';

const crypto = {
  kdf: 'argon2id',
  kdfparams: {
    parallelism: 4,
    iterations: 1,
    memory: 2048,
    salt: '30fc0301d36fcdc7bd8204e19a0043fc',
  },
  cipher: 'aes-256-gcm',
  cipherparams: {
    iv: '281d21872c2d303e59850ce4',
    tag: '2458479edf6aea5c748021ae296e467d',
  },
  ciphertext:
    '44fdb2b132d353a5c65f04e5e3afdd531f63abc45444ffd4cdbc7dedc45f899bf5b7478947d57319ea8c620e13480def8a518cc05e46bdddc8ef7c8cfc21a3bd',
};
const recoveryPhrase =
  'target cancel solution recipe vague faint bomb convince pink vendor fresh patrol';
const mockSetAccount = jest.fn();

jest.mock('react-i18next');
jest.spyOn(cryptography.encrypt, 'encryptMessageWithPassword').mockResolvedValue(crypto);
jest.spyOn(cryptography.encrypt, 'decryptMessageWithPassword').mockResolvedValue(
  JSON.stringify({
    recoveryPhrase,
  })
);
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

const props = {
  onSubmit: jest.fn((value) => value),
  recoveryPhrase: {
    value: 'target cancel solution recipe vague faint bomb convince pink vendor fresh patrol',
    isValid: true,
  },
  prevStep: jest.fn(),
};
let password = null;
let cPassword = null;
let hasAgreed = null;
let accountName = null;

beforeEach(() => {
  render(<SetPasswordForm {...props} />);

  password = screen.getByTestId('password');
  cPassword = screen.getByTestId('cPassword');
  accountName = screen.getByTestId('accountName');
  hasAgreed = screen.getByTestId('hasAgreed');
});

const makeSubmitActive = () => {
  fireEvent.change(password, { target: { value: 'P' } });
  fireEvent.change(cPassword, { target: { value: 'cp' } });
  fireEvent.click(hasAgreed);
};

describe('Set Password Form validation should work', () => {
  it('returns to previous page if the back button is clicked', () => {
    fireEvent.click(screen.getByText('Go back'));
    expect(props.prevStep).toHaveBeenCalled();
  });

  it('submit button should be disabled', async () => {
    fireEvent.change(password, { target: { value: 'password' } });
    expect(screen.getByText('Save Account')).toHaveAttribute('disabled');

    fireEvent.change(cPassword, { target: { value: 'cPassword' } });
    expect(screen.getByText('Save Account')).toHaveAttribute('disabled');

    fireEvent.click(hasAgreed);
    expect(screen.getByText('Save Account')).not.toHaveAttribute('disabled');
  });

  it('should display an error if password length is not up to 8', async () => {
    makeSubmitActive();
    fireEvent.click(screen.getByText('Save Account'));

    await waitFor(() => {
      expect(
        screen.getByText(
          'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'
        )
      ).toBeTruthy();
    });
  });

  it('should display an error if password does not have a number', async () => {
    makeSubmitActive();
    fireEvent.change(password, { target: { value: 'Passsssss*' } });
    fireEvent.click(screen.getByText('Save Account'));

    await waitFor(() => {
      expect(
        screen.getByText(
          'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'
        )
      ).toBeTruthy();
    });
  });

  it('should display an error if password does not have a combination of upper an lowercase characters', async () => {
    makeSubmitActive();
    fireEvent.change(password, { target: { value: 'tesssssttt12$' } });
    fireEvent.click(screen.getByText('Save Account'));

    await waitFor(() => {
      expect(
        screen.getByText(
          'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'
        )
      ).toBeTruthy();
    });
  });

  it('should display an error if password does not have special characters', async () => {
    makeSubmitActive();
    fireEvent.change(password, { target: { value: 'tesssssttt12A' } });
    fireEvent.click(screen.getByText('Save Account'));

    await waitFor(() => {
      expect(
        screen.getByText(
          'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'
        )
      ).toBeTruthy();
    });
  });

  it('should display an error if confirm password is not the same as the password', async () => {
    makeSubmitActive();
    fireEvent.change(password, { target: { value: 'Password1$' } });
    fireEvent.change(cPassword, { target: { value: 'Password1@' } });
    fireEvent.click(screen.getByText('Save Account'));

    await waitFor(() => {
      expect(screen.getByText('Confirm that passwords match')).toBeTruthy();
    });
  });

  it('should display an error if account name already exists', async () => {
    fireEvent.change(password, { target: { value: 'Password1$' } });
    fireEvent.change(cPassword, { target: { value: 'Password1$' } });
    fireEvent.change(accountName, { target: { value: 'account_1' } });
    fireEvent.click(hasAgreed);
    fireEvent.click(screen.getByText('Save Account'));

    await waitFor(() => {
      expect(screen.getByText(`Account with name "account_1" already exists.`)).toBeTruthy();
    });
  });

  it('should invoke onSubmit with form values when validation is okay', async () => {
    fireEvent.change(password, { target: { value: 'Password1$' } });
    fireEvent.change(cPassword, { target: { value: 'Password1$' } });
    fireEvent.change(accountName, { target: { value: 'username1' } });
    fireEvent.click(hasAgreed);
    fireEvent.click(screen.getByText('Save Account'));

    await waitFor(() => {
      expect(mockOnMessage).toHaveBeenCalledWith({
        accountName: 'username1',
        cPassword: 'Password1$',
        customDerivationPath: undefined,
        enableAccessToLegacyAccounts: undefined,
        hasAgreed: true,
        password: 'Password1$',
        recoveryPhrase: {
          isValid: true,
          value: 'target cancel solution recipe vague faint bomb convince pink vendor fresh patrol',
        },
      });
    });
  });
});
