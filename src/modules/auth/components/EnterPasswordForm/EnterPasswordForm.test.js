import React from 'react';
import {
  fireEvent, render, screen, waitFor,
} from '@testing-library/react';

import { decryptAccount } from '@account/utils/encryptAccount';
import EnterPasswordForm from '.';

const recoveryPhrase = 'target cancel solution recipe vague faint bomb convince pink vendor fresh patrol';

jest.mock('@account/utils/encryptAccount');

describe('EnterPasswordForm', () => {
  let wrapper;
  const encryptedPassphrase = {
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
  const props = {
    encryptedAccount: {
      encryptedPassphrase,
      metadata: {
        address: 'lskm555k7nhhw954rw4pqy5q9wn28n3cec94fmp4n',
        name: 'Lisker',
      },
    },
    onEnterPasswordSuccess: jest.fn(),
    nextStep: jest.fn(),
  };
  const accountPassword = 'qwerty';

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = render(<EnterPasswordForm {...props} />);
  });

  it('should display properly', () => {
    expect(screen.queryByText(props.encryptedAccount.metadata.name));
    expect(screen.queryByText(props.encryptedAccount.metadata.address));
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
        props.encryptedAccount.encryptedPassphrase,
        accountPassword,
      );
      expect(props.onEnterPasswordSuccess).toHaveBeenCalledWith({
        recoveryPhrase,
        encryptedAccount: props.encryptedAccount,
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
