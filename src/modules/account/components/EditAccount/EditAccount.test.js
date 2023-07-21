import { screen, fireEvent, waitFor } from '@testing-library/react';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { renderWithCustomRouter } from 'src/utils/testHelpers';
import routes from 'src/routes/routes';
import EditAccount from './EditAccount';

jest.mock('react-i18next');
jest.mock('@account/hooks', () => ({
  useCurrentAccount: jest.fn(() => [mockSavedAccounts[0], jest.fn()]),
  useAccounts: jest.fn(() => ({
    accounts: mockSavedAccounts,
  })),
}));

const props = { history: { push: jest.fn() } };
beforeEach(() => {
  renderWithCustomRouter(EditAccount, props);
});

describe('Edit Account', () => {
  it('renders properly', async () => {
    const updatedAccountName = 'updated_lisk_account';
    expect(screen.getByText('Account name')).toBeInTheDocument();
    fireEvent.change(screen.getByTestId('accountName'), {
      target: { value: updatedAccountName },
    });
    await waitFor(() => {
      fireEvent.click(screen.getByText('Save'));
    });
    expect(screen.getByText('Edit account name')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Successfully edited, now you can download the encrypted secret recovery phrase to this effect.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Back to wallet')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Back to wallet'));
    expect(props.history.push).toHaveBeenCalledTimes(1);
    expect(props.history.push).toHaveBeenCalledWith(routes.wallet.path);
  });
});
