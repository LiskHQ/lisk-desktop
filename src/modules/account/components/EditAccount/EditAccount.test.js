import { screen, fireEvent, waitFor } from '@testing-library/react';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { renderWithCustomRouter } from 'src/utils/testHelpers';
import routes from 'src/routes/routes';
import EditAccount from './EditAccount';

jest.mock('react-i18next');
jest.mock('@account/hooks', () => ({
  useCurrentAccount: jest.fn(() => [mockSavedAccounts[0], jest.fn()]),
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
      fireEvent.click(screen.getByText('Done'));
    });
    expect(screen.getByText('Edit account name successful')).toBeInTheDocument();
    expect(
      screen.getByText('You can now download encrypted secret recovery phrase to this effect.')
    ).toBeInTheDocument();
    expect(
      screen.getByText(`encrypted_secret_recovery_phrase_${updatedAccountName}.json`)
    ).toBeInTheDocument();
    expect(screen.getByText('Go to wallet')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Go to wallet'));
    expect(props.history.push).toHaveBeenCalledTimes(1);
    expect(props.history.push).toHaveBeenCalledWith(routes.wallet.path);
  });
});
