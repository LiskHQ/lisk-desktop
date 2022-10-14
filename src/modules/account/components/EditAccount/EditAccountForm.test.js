import { screen, fireEvent, waitFor } from '@testing-library/react';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { renderWithRouter } from 'src/utils/testHelpers';
import EditAccountForm from './EditAccountForm';

jest.mock('react-i18next');
jest.mock('@account/hooks', () => ({
  useCurrentAccount: jest.fn(() => [mockSavedAccounts[0], jest.fn()]),
}));

const props = { nextStep: jest.fn() };

beforeEach(() => {
  renderWithRouter(EditAccountForm, props);
});

describe('Edit account', () => {
  it('should render properly', async () => {
    const defaultAccountName = mockSavedAccounts[0].metadata.name;
    const updatedAccountName = 'updated_lisk_account';

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

  it('should throw errors if account name is empty', async () => {
    expect(screen.getByText('Account name')).toBeInTheDocument();
    fireEvent.change(screen.getByTestId('accountName'), {
      target: { value: 'ac' },
    });
    await waitFor(() => {
      fireEvent.click(screen.getByText('Done'));
    });
    fireEvent.change(screen.getByTestId('accountName'), {
      target: { value: '' },
    });
    await waitFor(() => {
      expect(screen.getByText('accountName is a required field')).toBeInTheDocument();
    });
  });

  it('should display errors if account name is invalid', async () => {
    const invalidAccountName = 'invalid account name';
    expect(screen.getByText('Account name')).toBeInTheDocument();
    fireEvent.change(screen.getByTestId('accountName'), {
      target: { value: invalidAccountName },
    });
    await waitFor(() => {
      fireEvent.click(screen.getByText('Done'));
    });
    await waitFor(() => {
      expect(
        screen.getByText('Can be alphanumeric with either !,@,$,&,_,. as special characters')
      ).toBeInTheDocument();
    });
  });
});
