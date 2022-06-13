import React from 'react';
import {
  fireEvent, render, screen, waitFor,
} from '@testing-library/react';

import { decryptAccount } from '@account/utils/decryptAccount';
import EnterPasswordForm from '.';

jest.mock('@account/utils/decryptAccount');

describe('EnterPasswordForm', () => {
  let wrapper;
  const props = {
    accountSchema: {
      metadata: {
        address: 'lskm555k7nhhw954rw4pqy5q9wn28n3cec94fmp4n',
        name: 'Lisker',
      },
    },
    onEnterPasswordSuccess: jest.fn(),
    nextStep: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = render(<EnterPasswordForm {...props} />);
  });

  it('should display properly', () => {
    expect(screen.queryByText(props.accountSchema.metadata.name));
    expect(screen.queryByText(props.accountSchema.metadata.address));
  });

  it('should call onEnterPasswordSuccess when onSubmit click', async () => {
    const privateToken = 'private-token-mock';
    const recoveryPhrase = 'target cancel solution recipe vague faint bomb convince pink vendor fresh patrol';
    decryptAccount.mockImplementation(() => (
      {
        privateToken,
        recoveryPhrase,
      }
    ));
    props.recoveryPhrase = recoveryPhrase;
    wrapper.rerender(<EnterPasswordForm {...props} />);

    fireEvent.change(screen.getByTestId('password'), { target: { value: 'qwerty' } });
    fireEvent.click(screen.getByText('Continue'));

    await waitFor(() => {
      expect(decryptAccount).toHaveBeenCalledWith(
        props.accountSchema,
        'qwerty',
      );
      expect(props.onEnterPasswordSuccess).toHaveBeenCalledWith({
        account: { privateToken, recoveryPhrase },
        recoveryPhrase,
        encryptedPhrase: props.accountSchema,
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
