import React from 'react';
import {
  fireEvent, render, screen,
} from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import mockSavedAccounts from '@tests/fixtures/accounts';
import routes from 'src/routes/routes';
import ManageAccounts from './ManageAccounts';

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

const props = {
  isRemoveAvailable: true,
};
const history = createMemoryHistory({
  initialEntries: ['/'],
});
let wrapper;
beforeEach(() => {
  wrapper = render(<Router history={history}><ManageAccounts {...props} /></Router>);
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
    expect(history.location.pathname).toEqual(routes.addAccountOptions.path);
  });

  it('Should trigger the onSelectAccount callback', async () => {
    fireEvent.click(screen.getByTestId(mockSavedAccounts[0].metadata.address));
    expect(history.location.pathname).toEqual(routes.dashboard.path);
  });

  it('should show and hide remove button', async () => {
    expect(screen.getByTestId('manage-title')).toHaveTextContent('Manage accounts');
    fireEvent.click(screen.getByText('Remove an account'));
    expect(screen.getByText('Done')).toBeTruthy();
    expect(screen.getByTestId('manage-title')).toHaveTextContent('Choose account');
    expect(screen.getByTestId(`${mockSavedAccounts[0].metadata.address}-delete`)).toBeTruthy();
    fireEvent.click(screen.getByText('Done'));
    expect(screen.getByTestId('manage-title')).toHaveTextContent('Manage accounts');
    expect(() => screen.getByText('Done')).toThrow('Unable to find an element');
  });

  it('delete Should trigger on remove', async () => {
    fireEvent.click(screen.getByText('Remove an account'));
    fireEvent.click(screen.getByTestId(`${mockSavedAccounts[0].metadata.address}-delete`));
    expect(history.location.pathname).toEqual(routes.removeSelectedAccount.path);
  });

  it('Should revert back to select account if done is clicked', async () => {
    fireEvent.click(screen.getByText('Remove an account'));
    fireEvent.click(screen.getByText('Done'));
    expect(screen.getByText('Remove an account')).toBeTruthy();
    expect(screen.getByText('Add another account')).toBeTruthy();
    expect(screen.getByText('Manage accounts')).toBeTruthy();
  });

  it('Should change title based on props', async () => {
    expect(screen.getByTestId('manage-title')).toHaveTextContent('Manage accounts');
    wrapper.rerender(<Router history={history}><ManageAccounts {...props} title="Switch account" /></Router>);
    expect(screen.getByTestId('manage-title')).toHaveTextContent('Switch account');
  });

  it('Should change title based on props', async () => {
    expect(screen.getByText('Remove an account')).toBeTruthy();
    wrapper.rerender(<Router history={history}>
      <ManageAccounts {...props} isRemoveAvailable={false} />
    </Router>);
    expect(() => screen.getByText('Remove an account')).toThrow('Unable to find an element');
  });
});
