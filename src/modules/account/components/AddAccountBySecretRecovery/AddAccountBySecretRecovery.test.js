import {
  createEvent, fireEvent, screen, waitFor,
} from '@testing-library/react';
import mockSavedAccounts from '@tests/fixtures/accounts';
import * as reactRedux from 'react-redux';
import { renderWithRouter } from 'src/utils/testHelpers';
import AddAccountByPassPhrase from './AddAccountBySecretRecovery';

jest.mock('react-i18next');
jest.mock('../../hooks/useAccounts', () => ({
  useAccounts: jest.fn().mockReturnValue([mockSavedAccounts]),
}));
reactRedux.useSelector = jest.fn().mockReturnValue(mockSavedAccounts[0]);

const props = {
  history: { push: jest.fn() },
  login: jest.fn(),
};

beforeEach(() => {
  renderWithRouter(AddAccountByPassPhrase, props);
});

describe('Add account by secret recovery phrase flow', () => {
  it('Should successfully go though the flow', async () => {
    expect(screen.getByText('Add account')).toBeTruthy();
    expect(screen.getByText('Enter your secret recovery phrase to manage your account.')).toBeTruthy();
    expect(screen.getByText('Continue')).toBeTruthy();
    expect(screen.getByText('Go Back')).toBeTruthy();

    const inputField = screen.getByTestId('recovery-1');
    const pasteEvent = createEvent.paste(inputField, {
      clipboardData: {
        getData: () => 'below record evolve eye youth post control consider spice swamp hidden easily',
      },
    });

    fireEvent(inputField, pasteEvent);
    fireEvent.click(screen.getByText('Continue'));

    const password = screen.getByTestId('password');
    const cPassword = screen.getByTestId('cPassword');
    const accountName = screen.getByTestId('accountName');
    const hasAgreed = screen.getByTestId('hasAgreed');

    fireEvent.change(password, { target: { value: 'Password1$' } });
    fireEvent.change(cPassword, { target: { value: 'Password1$' } });
    fireEvent.change(accountName, { target: { value: 'test account name' } });
    fireEvent.click(hasAgreed);
    fireEvent.click(screen.getByText('Save Account'));

    await waitFor(() => {
      expect(screen.getByText('Perfect! You\'re all set')).toBeTruthy();
      expect(screen.getByText('You can now download your encrypted secret recovery phrase and use it to add your account on other devices.')).toBeTruthy();
      expect(screen.getByText('Download')).toBeTruthy();

      fireEvent.click(screen.getByText('Continue to Dashboard'));

      expect(props.login).toBeCalled();
    });
  });
});
