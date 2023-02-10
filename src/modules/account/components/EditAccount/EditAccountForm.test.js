import { screen, fireEvent, waitFor } from '@testing-library/react';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { renderWithRouter } from 'src/utils/testHelpers';
import { hwAccounts } from 'src/modules/hardwareWallet/__fixtures__/hwAccounts';
import { settingsUpdated } from 'src/redux/actions';
import { useCurrentAccount } from '@account/hooks/useCurrentAccount';
import EditAccountForm from './EditAccountForm';

const mockHWAccounts = hwAccounts;
const mockDispatch = jest.fn();
const mockSelector = {
  settings: {
    hardwareAccounts: {
      'Nano S': mockHWAccounts,
    },
  },
};

jest.mock('react-i18next');
jest.mock('@account/hooks/useCurrentAccount');
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: jest.fn((fn) => fn(mockSelector)),
}));

const props = { nextStep: jest.fn() };

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Edit account', () => {
  it('should render properly', async () => {
    useCurrentAccount.mockReturnValue([mockSavedAccounts[0], jest.fn()]);
    renderWithRouter(EditAccountForm, props);
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
    useCurrentAccount.mockReturnValue([mockSavedAccounts[0], jest.fn()]);
    renderWithRouter(EditAccountForm, props);
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
    useCurrentAccount.mockReturnValue([mockSavedAccounts[0], jest.fn()]);
    renderWithRouter(EditAccountForm, props);
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

  it('allows for editing hardware wallet account name', async () => {
    useCurrentAccount.mockReturnValue([hwAccounts[0], jest.fn()]);
    renderWithRouter(EditAccountForm, props);

    const updatedAccountName = 'updated_hw_account';
    expect(screen.getByText('Account name')).toBeInTheDocument();
    fireEvent.change(screen.getByTestId('accountName'), {
      target: { value: updatedAccountName },
    });
    await waitFor(() => {
      fireEvent.click(screen.getByText('Done'));
    });
    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockDispatch).toHaveBeenCalledWith(
      settingsUpdated(expect.objectContaining({ hardwareAccounts: { 'Nano S': [hwAccounts[0]] } }))
    );
  });
});
