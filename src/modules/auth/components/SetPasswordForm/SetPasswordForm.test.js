import {
  fireEvent, screen, waitFor,
} from '@testing-library/react';
import { renderWithRouter } from 'src/utils/testHelpers';
import SetPasswordForm from './SetPasswordForm';

jest.mock('react-i18next');

const props = {
  onSubmit: jest.fn((value) => value),
  recoveryPhrase: {
    value: 'target cancel solution recipe vague faint bomb convince pink vendor fresh patrol',
    isValid: true,
  },
};
let password = null;
let cPassword = null;
let hasAgreed = null;
let accountName = null;

beforeEach(() => {
  renderWithRouter(SetPasswordForm, props);

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
  it('Submit button should be disabled', async () => {
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
        screen.getByText('Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'),
      ).toBeTruthy();
    });
  });

  it('should display an error if password does not have a number', async () => {
    makeSubmitActive();
    fireEvent.change(password, { target: { value: 'Passsssss*' } });
    fireEvent.click(screen.getByText('Save Account'));

    await waitFor(() => {
      expect(
        screen.getByText('Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'),
      ).toBeTruthy();
    });
  });

  it('should display an error if password does not have a combination of upper an lowercase characters', async () => {
    makeSubmitActive();
    fireEvent.change(password, { target: { value: 'tesssssttt12$' } });
    fireEvent.click(screen.getByText('Save Account'));

    await waitFor(() => {
      expect(
        screen.getByText('Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'),
      ).toBeTruthy();
    });
  });

  it('should display an error if password does not have special characters', async () => {
    makeSubmitActive();
    fireEvent.change(password, { target: { value: 'tesssssttt12A' } });
    fireEvent.click(screen.getByText('Save Account'));

    await waitFor(() => {
      expect(
        screen.getByText('Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'),
      ).toBeTruthy();
    });
  });

  it('should display an error if confirm password is not the same as the passowrd', async () => {
    makeSubmitActive();
    fireEvent.change(password, { target: { value: 'Password1$' } });
    fireEvent.change(cPassword, { target: { value: 'Password1@' } });
    fireEvent.click(screen.getByText('Save Account'));

    await waitFor(() => {
      expect(
        screen.getByText('Confirm that passwords match'),
      ).toBeTruthy();
    });
  });

  it('should invoke onSubmit with form values when validation is okay', async () => {
    fireEvent.change(password, { target: { value: 'Password1$' } });
    fireEvent.change(cPassword, { target: { value: 'Password1$' } });
    fireEvent.change(accountName, { target: { value: 'test account name' } });
    fireEvent.click(hasAgreed);
    fireEvent.click(screen.getByText('Save Account'));

    await waitFor(() => expect(props.onSubmit).toHaveBeenCalled());
  });
});
