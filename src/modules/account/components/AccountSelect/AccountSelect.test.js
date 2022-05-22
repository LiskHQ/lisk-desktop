import React from 'react';
import {
  fireEvent, render, screen,
} from '@testing-library/react';
import mockSavedAccounts from '@tests/fixtures/accounts';
import AccountSelect from './AccountSelect';

jest.mock('react-i18next');
jest.mock('../../hooks/useAccounts', () => ({
  useAccounts: jest.fn().mockReturnValue([mockSavedAccounts]),
}));

const props = {
  onSelectAccount: jest.fn(),
  onRemoveAccount: jest.fn(),
};

beforeEach(() => {
  render(<AccountSelect {...props} />);
});

describe('Select Account Formshould work', () => {
  it('Should render account list properly', async () => {
    expect(screen.getByText('lsk74ar23k2zk3mpsnryxbxf5yf9ystudqmj4oj6e')).toBeTruthy();
    expect(screen.getByText('my lisk account')).toBeTruthy();
    expect(screen.getByText('Remove an account')).toBeTruthy();
    expect(screen.getByText('Add another account')).toBeTruthy();
    expect(screen.getByText('Manage accounts')).toBeTruthy();
  });

  it('Should trigger the onSelectAccount callback', async () => {
    fireEvent.click(screen.getByTestId(mockSavedAccounts[0].uuid));
    expect(props.onSelectAccount).toBeCalledWith(mockSavedAccounts[0]);
  });

  it('Should show accounts with the delete trigger', async () => {
    fireEvent.click(screen.getByText('Remove an account'));
    expect(screen.getByText('Done')).toBeTruthy();
    expect(screen.getByText('Choose account')).toBeTruthy();
    fireEvent.click(screen.getByTestId('delete-icon'));
    expect(props.onRemoveAccount).toBeCalledWith(mockSavedAccounts[0]);
  });

  it('Should revert back to select account if done is clicked', async () => {
    fireEvent.click(screen.getByText('Remove an account'));
    fireEvent.click(screen.getByText('Done'));
    expect(screen.getByText('Remove an account')).toBeTruthy();
    expect(screen.getByText('Add another account')).toBeTruthy();
    expect(screen.getByText('Manage accounts')).toBeTruthy();
  });
});
