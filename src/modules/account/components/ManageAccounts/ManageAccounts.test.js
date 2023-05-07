import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { mockHWAccounts } from '@hardwareWallet/__fixtures__';
import routes from 'src/routes/routes';
import ManageAccounts from './ManageAccounts';

const mockSetAccount = jest.fn();
jest.mock('react-i18next');
jest.mock('@account/hooks', () => ({
  useAccounts: jest.fn(() => ({
    accounts: mockSavedAccounts,
  })),
  useCurrentAccount: jest.fn(() => [mockSavedAccounts[0], mockSetAccount]),
}));
jest.mock('src/modules/hardwareWallet/hooks/useHWAccounts', () =>
  jest.fn().mockReturnValue({ accounts: mockHWAccounts })
);
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

const props = {
  isRemoveAvailable: true,
};
const history = createMemoryHistory({
  initialEntries: ['/'],
});
let wrapper;
beforeEach(() => {
  wrapper = render(
    <Router history={history}>
      <ManageAccounts {...props} />
    </Router>
  );
});

describe('Account Select Form', () => {
  const firstItemMetadata = mockSavedAccounts[0].metadata;
  const firstItemAddress = firstItemMetadata.address;

  it('Should render account list properly', async () => {
    expect(screen.getByText(firstItemAddress)).toBeTruthy();
    expect(screen.getByText(firstItemMetadata.name)).toBeTruthy();
    expect(screen.getByText('Remove an account')).toBeTruthy();
    expect(screen.getByText('Add another account')).toBeTruthy();
    expect(screen.getByText('Manage accounts')).toBeTruthy();
  });

  it('Should trigger the onAddAccount callback', async () => {
    fireEvent.click(screen.getByText('Add another account'));
    expect(history.location.pathname).toEqual(routes.addAccountOptions.path);
  });

  it('Should trigger the onSelectAccount callback', async () => {
    fireEvent.click(screen.getByTestId(firstItemAddress));
    expect(history.location.pathname).toEqual(routes.wallet.path);
  });

  it('should show and hide remove button', async () => {
    expect(screen.getByTestId('manage-title')).toHaveTextContent('Manage accounts');
    fireEvent.click(screen.getByText('Remove an account'));
    expect(screen.getByText('Done')).toBeTruthy();
    expect(screen.getByTestId('manage-title')).toHaveTextContent('Choose account');
    expect(screen.getByTestId(`${firstItemAddress}-delete`)).toBeTruthy();
    fireEvent.click(screen.getByText('Done'));
    expect(screen.getByTestId('manage-title')).toHaveTextContent('Manage accounts');
    expect(() => screen.getByText('Done')).toThrow('Unable to find an element');
  });

  it('delete Should trigger on remove', async () => {
    fireEvent.click(screen.getByText('Remove an account'));
    fireEvent.click(screen.getByTestId(`${firstItemAddress}-delete`));
    const toEqual = `?modal=removeSelectedAccount&address=${firstItemAddress}`;
    expect(history.location.search).toEqual(toEqual);
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
    wrapper.rerender(
      <Router history={history}>
        <ManageAccounts {...props} title="Switch account" />
      </Router>
    );
    expect(screen.getByTestId('manage-title')).toHaveTextContent('Switch account');
  });

  it('Remove an account', async () => {
    expect(screen.getByText('Remove an account')).toBeTruthy();
    wrapper.rerender(
      <Router history={history}>
        <ManageAccounts {...props} isRemoveAvailable={false} />
      </Router>
    );
    expect(() => screen.getByText('Remove an account')).toThrow('Unable to find an element');
  });
});
