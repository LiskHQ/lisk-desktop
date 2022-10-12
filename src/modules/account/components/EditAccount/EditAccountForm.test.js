import mockSavedAccounts from '@tests/fixtures/accounts';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithRouter } from 'src/utils/testHelpers';
import EditAccountForm from './EditAccountForm';

jest.mock('react-i18next');
jest.mock('@account/hooks', () => ({
  useAccounts: jest.fn(() => ({
    accounts: mockSavedAccounts,
  })),
  useCurrentAccount: jest.fn(() => [mockSavedAccounts[0], jest.fn()]),
}));

describe('Edit account', () => {
  it('Should render properly', async () => {
    const props = { nextStep: jest.fn() };
    const defaultAccountName = mockSavedAccounts[0].metadata.name;
    const updatedAccountName = 'updated_lisk_account';
    renderWithRouter(EditAccountForm, props);

    expect(screen.getByText('Account name')).toBeInTheDocument();
    expect(screen.getByTestId('accountName').value).toBe(defaultAccountName);
    fireEvent.change(screen.getByTestId('accountName'), {
      target: { value: updatedAccountName },
    });
    await waitFor(() => {
      fireEvent.click(screen.getByText('Done'));
    });
    await waitFor(() => {
      expect(props.nextStep).toHaveBeenCalledTimes(1);
      expect(props.nextStep).toHaveBeenCalledWith({ accountName: updatedAccountName });
    });
  });
});
