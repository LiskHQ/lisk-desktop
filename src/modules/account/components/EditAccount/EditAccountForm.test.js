import { screen, fireEvent, waitFor } from '@testing-library/react';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { renderWithRouter } from 'src/utils/testHelpers';
import { mockHWAccounts } from '@hardwareWallet/__fixtures__';
import { useCurrentAccount } from '@account/hooks/useCurrentAccount';
import { updateCurrentAccount, updateAccount } from '../../store/action';
import EditAccountForm from './EditAccountForm';

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
    const currentAccount = mockSavedAccounts[0];
    useCurrentAccount.mockReturnValue([currentAccount, jest.fn()]);
    renderWithRouter(EditAccountForm, props);
    const defaultAccountName = currentAccount.metadata.name;
    const updatedAccountName = 'updated_lisk_account';

    expect(screen.getByText('Account name')).toBeInTheDocument();
    expect(screen.getByTestId('accountName').value).toBe(defaultAccountName);
    fireEvent.change(screen.getByTestId('accountName'), {
      target: { value: updatedAccountName },
    });
    await waitFor(() => {
      fireEvent.click(screen.getByText('Done'));
    });
    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockDispatch).toHaveBeenCalledWith(updateCurrentAccount({ name: updatedAccountName }));
    expect(mockDispatch).toHaveBeenCalledWith(
      updateAccount({
        encryptedAccount: currentAccount,
        accountDetail: { name: updatedAccountName },
      })
    );
    expect(props.nextStep).toHaveBeenCalledTimes(1);
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
    useCurrentAccount.mockReturnValue([mockHWAccounts[0], jest.fn()]);
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
  });
});
