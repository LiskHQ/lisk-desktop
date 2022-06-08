import {
  createEvent, fireEvent, screen, waitFor,
} from '@testing-library/react';
import mockSavedAccounts from '@tests/fixtures/accounts';
import * as reactRedux from 'react-redux';
import { renderWithRouter } from 'src/utils/testHelpers';
import AddAccountByFile from './AddAccountByFile';

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
  renderWithRouter(AddAccountByFile, props);
});

describe('Add account by file flow', () => {
  it('Should successfull go though the flow', async () => {
    expect(screen.getByText('Add account')).toBeTruthy();
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

    expect(screen.getByText('Enter your password')).toBeTruthy();
    expect(screen.getByText('Please provide your device password to backup the recovery phrase.')).toBeTruthy();
    expect(screen.getByText(mockSavedAccounts[0].metadata.name)).toBeTruthy();
    expect(screen.getByText(mockSavedAccounts[0].metadata.address)).toBeTruthy();

    const password = screen.getByTestId('passwordField');
    fireEvent.change(password, { target: { value: 'Password1$' } });
    fireEvent.click(screen.getByText('Continue'));
    expect(props.login).toBeCalled();

    await waitFor(() => {
      expect(screen.getByText('Perfect! You\'re all set')).toBeTruthy();
      fireEvent.click(screen.getByText('Continue to Dashboard'));
    });
  });
});
