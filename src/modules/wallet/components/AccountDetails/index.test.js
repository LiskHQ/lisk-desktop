import { screen, fireEvent, waitFor } from '@testing-library/react';
import { smartRender } from 'src/utils/testHelpers';
import { useAuth } from '@auth/hooks/queries';
import { useValidators } from '@pos/validator/hooks/queries';
import mockSavedAccounts from '@tests/fixtures/accounts';
import * as transactionUtils from '@transaction/utils/transaction';
import { updateHWAccount } from '@hardwareWallet/store/actions';
import actionTypes from 'src/modules/hardwareWallet/store/actions/actionTypes';
import { truncateAddress } from '../../utils/account';
import AccountDetails from '.';

const currentAccount = mockSavedAccounts[0];
const mockHistory = {
  location: {
    search: '?address=lsk3ay4z7wqjczbo5ogcqxgxx23xyacxmycwxfh4d',
  },
  push: jest.fn(),
  goBack: jest.fn(),
};

jest.mock('@auth/hooks/queries/useAuth');
jest.mock('@hardwareWallet/store/actions');
jest.mock('@pos/validator/hooks/queries/useValidators');
jest.mock('@transaction/utils/transaction', () => ({
  downloadJSON: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => mockHistory,
  useLocation: jest.fn().mockReturnValue({ search: '/' }),
}));

const config = {
  queryClient: true,
  store: true,
  storeInfo: {
    account: { current: currentAccount, list: mockSavedAccounts },
  },
};
const { name: acctName, address: acctAddress, pubkey: acctPubkey } = currentAccount.metadata;

const mockAuth = {
  data: {
    nonce: '3',
    numberOfSignatures: 0,
    mandatoryKeys: [],
    optionalKeys: [],
  },
  meta: {
    address: 'lsk3ay4z7wqjczbo5ogcqxgxx23xyacxmycwxfh4d',
    publicKey: 'cf434a889d6c7a064e8de61bb01759a76f585e5ff45a78ba8126ca332601f535',
    name: '',
  },
  links: {},
};

describe('AccountDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders properly for a regular account', () => {
    useAuth.mockReturnValue({ data: mockAuth });
    useValidators.mockReturnValue({});

    smartRender(AccountDetails, null, config);

    expect(screen.getByText('Account details')).toBeInTheDocument();
    expect(screen.getByText(acctName)).toBeInTheDocument();
    expect(screen.getByText(truncateAddress(acctAddress))).toBeInTheDocument();
    expect(screen.getByText(truncateAddress(acctPubkey))).toBeInTheDocument();
    expect(screen.getByText('Nonce:')).toBeInTheDocument();
    expect(screen.getByText(mockAuth.data.nonce)).toBeInTheDocument();
    expect(screen.getByAltText('edit')).toBeInTheDocument();
  });

  it('renders with default values if authData is not returned', () => {
    useAuth.mockReturnValue({ data: undefined });
    useValidators.mockReturnValue({});

    smartRender(AccountDetails, null, config);

    expect(screen.getByText('Account details')).toBeInTheDocument();
    expect(screen.getByText(acctName)).toBeInTheDocument();
    expect(screen.getByText('Nonce:')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders properly for a validator account', () => {
    const validatorName = 'genesis_1';
    const mockValidatorAuth = { ...mockAuth, meta: { ...mockAuth.meta, name: validatorName } };
    useAuth.mockReturnValue({ data: mockValidatorAuth });
    useValidators.mockReturnValue({
      data: {
        data: [{ name: validatorName, address: acctAddress, publicKey: acctPubkey, rank: 8 }],
      },
    });

    smartRender(AccountDetails, null, config);

    expect(screen.getByText('Account details')).toBeInTheDocument();
    expect(screen.getAllByText(validatorName)[0]).toBeInTheDocument();
    expect(screen.getByText(truncateAddress(acctAddress))).toBeInTheDocument();
    expect(screen.getByText(truncateAddress(acctPubkey))).toBeInTheDocument();
    expect(screen.getByText('Validator details')).toBeInTheDocument();
    expect(screen.getByText('View profile')).toBeInTheDocument();
    expect(screen.getByText('#8')).toBeInTheDocument();
    expect(screen.getByAltText('edit')).toBeInTheDocument();
  });

  it('renders properly for a multisignature account', () => {
    const multisigMemberOne = '5f45dcfc9951d7499751b0ec9759bfebb6e5e7e1d21efec22d06e0972522116b';
    const multisigMemberTwo = 'd5dce13b6044486fc5561e7a8f481dd918ed7bdfeeb52dc81af9f283d98add45';
    const mockValidatorAuth = {
      ...mockAuth,
      data: {
        ...mockAuth.data,
        numberOfSignatures: 2,
        mandatoryKeys: [multisigMemberOne, multisigMemberTwo],
      },
    };
    useAuth.mockReturnValue({ data: mockValidatorAuth });
    useValidators.mockReturnValue({});

    smartRender(AccountDetails, null, config);

    expect(screen.getByText('Account details')).toBeInTheDocument();
    expect(screen.getByText(acctName)).toBeInTheDocument();
    expect(screen.getByText(truncateAddress(acctAddress))).toBeInTheDocument();
    expect(screen.getByText(truncateAddress(acctPubkey))).toBeInTheDocument();
    expect(screen.getByText('Multisignature details')).toBeInTheDocument();
    expect(screen.getByText('Required signatures')).toBeInTheDocument();
    expect(screen.getByText(': 2')).toBeInTheDocument();
    expect(screen.getByText(truncateAddress(multisigMemberOne))).toBeInTheDocument();
    expect(screen.getByText(truncateAddress(multisigMemberTwo))).toBeInTheDocument();
    expect(screen.getByAltText('multisigKeys')).toBeInTheDocument();
    expect(screen.getByAltText('edit')).toBeInTheDocument();
  });

  it('downloads account JSON on click', async () => {
    useAuth.mockReturnValue({ data: mockAuth });
    useValidators.mockReturnValue({});

    const fileName = `${acctAddress}-${acctName}-lisk-account`;

    smartRender(AccountDetails, null, config);

    fireEvent.click(screen.getByAltText('downloadBlue'));

    await waitFor(() => {
      expect(transactionUtils.downloadJSON).toHaveBeenCalledTimes(1);
      expect(transactionUtils.downloadJSON).toHaveBeenCalledWith(currentAccount, fileName);
    });
  });

  it('allows editing of the account name', async () => {
    useAuth.mockReturnValue({ data: mockAuth });
    useValidators.mockReturnValue({});

    smartRender(AccountDetails, null, config);

    fireEvent.click(screen.getByAltText('edit'));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Update name')).toBeVisible();
      expect(screen.getByText('Save changes')).toBeVisible();
    });

    fireEvent.click(screen.getByText('Cancel'));

    await waitFor(() => {
      expect(screen.queryByDisplayValue(acctName)).not.toBeInTheDocument();
      expect(screen.queryByText('Save changes')).not.toBeInTheDocument();
    });
  });

  it('displays error if edited account name exists in accounts list', async () => {
    useAuth.mockReturnValue({ data: mockAuth });
    useValidators.mockReturnValue({});

    smartRender(AccountDetails, null, config);

    fireEvent.click(screen.getByAltText('edit'));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Update name')).toBeVisible();
      expect(screen.getByText('Save changes')).toBeVisible();
    });

    const input = screen.getByTestId('accountName');
    fireEvent.change(input, { target: { value: 'account_2' } });
    fireEvent.click(screen.getByText('Save changes'));

    await waitFor(() => {
      expect(screen.getByText('Account with name "account_2" already exists.')).toBeInTheDocument();
    });
  });

  it('allows renaming hardware wallet accounts', async () => {
    useAuth.mockReturnValue({ data: mockAuth });
    useValidators.mockReturnValue({});
    updateHWAccount.mockImplementation((hwAccount) => ({
      type: actionTypes.updateHWAccount,
      hwAccount,
    }));
    const modifiedCurrentAccount = {
      ...currentAccount,
      metadata: { ...currentAccount.metadata, isHW: true },
    };
    const modifiedConfig = {
      ...config,
      storeInfo: {
        ...config.storeInfo,
        account: { ...config.storeInfo.account, current: modifiedCurrentAccount },
      },
    };
    const newHWAccountName = 'new_hw_account';
    const newCurrentAccount = {
      ...modifiedCurrentAccount,
      metadata: { ...modifiedCurrentAccount.metadata, name: newHWAccountName },
    };

    smartRender(AccountDetails, null, modifiedConfig);

    fireEvent.click(screen.getByAltText('edit'));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Update name')).toBeVisible();
      expect(screen.getByText('Save changes')).toBeVisible();
    });

    const input = screen.getByTestId('accountName');
    fireEvent.change(input, { target: { value: newHWAccountName } });
    fireEvent.click(screen.getByText('Save changes'));

    await waitFor(() => {
      expect(updateHWAccount).toBeCalledWith(newCurrentAccount);
    });
  });
});
