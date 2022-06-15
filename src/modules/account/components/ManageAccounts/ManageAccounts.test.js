import React from 'react';
import {
  fireEvent, render, screen,
} from '@testing-library/react';
import mockSavedAccounts from '@tests/fixtures/accounts';
import ManageAccounts from './ManageAccounts';

const mockPush = jest.fn();
const mockSetAccount = jest.fn();
jest.mock('react-i18next');
jest.mock('@account/hooks', () => ({
  useAccounts: jest.fn(() => ({
    accounts: mockSavedAccounts,
  })),
  useCurrentAccount: jest.fn(() => (
    [mockSavedAccounts[0], mockSetAccount]
  )),
}));
jest.mock('src/utils/history', () => ({
  push: mockPush,
}));

const props = {
  isRemoveAvailable: true,
};

beforeEach(() => {
  render(<ManageAccounts {...props} />);
});

describe('Account Select Form', () => {
  it('Should render account list properly', async () => {
    expect(screen.getByText(mockSavedAccounts[0].metadata.address)).toBeTruthy();
    expect(screen.getByText('my lisk account')).toBeTruthy();
    expect(screen.getByText('Remove an account')).toBeTruthy();
    expect(screen.getByText('Add another account')).toBeTruthy();
    expect(screen.getByText('Manage accounts')).toBeTruthy();
  });

  it('Should trigger the onAddAccount callback', async () => {
    fireEvent.click(screen.getByText('Add another account'));
    expect(props.onAddAccount).toHaveBeenCalledTimes(1);
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
    expect(mockPush).toBeCalledWith('', { address: mockSavedAccounts[0].metadata.address });
  });

  it('Should revert back to select account if done is clicked', async () => {
    fireEvent.click(screen.getByText('Remove an account'));
    fireEvent.click(screen.getByText('Done'));
    expect(screen.getByText('Remove an account')).toBeTruthy();
    expect(screen.getByText('Add another account')).toBeTruthy();
    expect(screen.getByText('Manage accounts')).toBeTruthy();
  });
});
