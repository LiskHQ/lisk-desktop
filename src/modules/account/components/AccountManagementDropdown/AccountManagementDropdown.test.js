import { screen, fireEvent } from '@testing-library/react';
import { renderWithRouterAndQueryClient } from 'src/utils/testHelpers';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { truncateAddress, truncateAccountName } from '@wallet/utils/account';
import { mockHWAccounts } from '@hardwareWallet/__fixtures__';
import { mockAppsTokens } from '@token/fungible/__fixtures__';
import { useAppsMetaTokens, useTokenBalances } from '@token/fungible/hooks/queries';
import * as searchParamUtils from 'src/utils/searchParams';
import { useAuth } from '@auth/hooks/queries';
import { useFees } from '@transaction/hooks/queries';
import AccountManagementDropdown from './AccountManagementDropdown';

const mockCurrentAccount = mockSavedAccounts[0];
const mockOnMenuClick = jest.fn();
jest.mock('../../../account/hooks/useCurrentAccount.js', () => ({
  useCurrentAccount: jest.fn(() => [mockCurrentAccount]),
}));

jest.mock('@token/fungible/hooks/queries/useTokenBalances');
jest.mock('@token/fungible/hooks/queries/useAppsMetaTokens');
jest.mock('@transaction/hooks/queries');
jest.mock('@auth/hooks/queries/useAuth');

describe('AccountManagementDropdown', () => {
  useAuth.mockReturnValue({
    data: {},
  });
  useTokenBalances.mockReturnValue({
    data: {
      data: [{ name: 'Lisk', symbol: 'LSK', availableBalance: 0, ...mockAppsTokens.data[0] }],
    },
  });
  useFees.mockReturnValue({
    data: { data: { feeTokenID: mockAppsTokens.data[0].tokenID } },
    isLoading: true,
  });
  useAppsMetaTokens.mockReturnValue({ data: mockAppsTokens, isLoading: false });

  it('displays properly', () => {
    const props = {
      currentAccount: mockCurrentAccount,
      onMenuClick: mockOnMenuClick,
    };
    renderWithRouterAndQueryClient(AccountManagementDropdown, props);
    expect(screen.getByText(mockCurrentAccount.metadata.name)).toBeInTheDocument();
    expect(
      screen.getByText(truncateAddress(mockCurrentAccount.metadata.address))
    ).toBeInTheDocument();
    fireEvent.click(screen.getByAltText('dropdownArrowIcon'));
    expect(mockOnMenuClick).toHaveBeenCalledTimes(2);
    expect(screen.getByText('Account details')).toBeInTheDocument();
    expect(screen.getByText('Switch account')).toBeInTheDocument();
    expect(screen.getByText('Backup account')).toBeInTheDocument();
    expect(screen.getByText('Add new account')).toBeInTheDocument();
    expect(screen.getByText('Register multisignature account')).toBeInTheDocument();
    expect(screen.getByText('Remove account')).toBeInTheDocument();
  });

  it('truncates account name if necessary', () => {
    const mockUpdatedCurrentAccount = {
      ...mockCurrentAccount,
      metadata: { ...mockCurrentAccount.metadata, name: 'very_long_account' },
    };
    const props = {
      currentAccount: mockUpdatedCurrentAccount,
      onMenuClick: mockOnMenuClick,
    };
    renderWithRouterAndQueryClient(AccountManagementDropdown, props);
    expect(
      screen.getByText(truncateAccountName(mockUpdatedCurrentAccount.metadata.name))
    ).toBeInTheDocument();
  });

  it('Should display hw icon when current account is a hardware wallet account', () => {
    const props = {
      currentAccount: mockHWAccounts[0],
      onMenuClick: mockOnMenuClick,
    };
    renderWithRouterAndQueryClient(AccountManagementDropdown, props);
    expect(screen.getByAltText('hardwareWalletIcon')).toBeTruthy();
  });

  it('Should dismiss menu when item is clicked', () => {
    const props = {
      currentAccount: mockHWAccounts[0],
      onMenuClick: mockOnMenuClick,
    };
    renderWithRouterAndQueryClient(AccountManagementDropdown, props);
    fireEvent.click(screen.getByAltText('dropdownArrowIcon'));
    fireEvent.click(screen.getByText('Backup account'));
    expect(screen.getByText('Register multisignature account')).toBeVisible();
  });

  it('Should have edit register multisignature enabled', () => {
    useAuth.mockReturnValue({
      data: { data: { numberOfSignatures: 3 } },
    });
    useFees.mockReturnValue({
      data: { data: { feeTokenID: mockAppsTokens.data[0].tokenID } },
      isLoading: true,
    });

    const props = {
      currentAccount: mockHWAccounts[0],
      onMenuClick: mockOnMenuClick,
    };
    renderWithRouterAndQueryClient(AccountManagementDropdown, props);
    fireEvent.click(screen.getByAltText('dropdownArrowIcon'));
    fireEvent.click(screen.getByText('Backup account'));
    expect(screen.getByText('Edit multisignature account')).toBeVisible();
  });

  it('Should render insufficient token error', () => {
    useTokenBalances.mockReturnValue({
      data: { data: mockAppsTokens.data.map((data) => ({ ...data, availableBalance: 0 })) },
      isLoading: true,
    });
    useAppsMetaTokens.mockReturnValue({ data: mockAppsTokens, isLoading: false });
    useFees.mockReturnValue({
      data: { data: { feeTokenID: mockAppsTokens.data[0].tokenID } },
      isLoading: true,
    });

    const mockAddSearchParamsToUrl = jest
      .spyOn(searchParamUtils, 'addSearchParamsToUrl')
      .mockReturnValue({});

    const props = {
      currentAccount: mockHWAccounts[0],
      onMenuClick: mockOnMenuClick,
    };

    renderWithRouterAndQueryClient(AccountManagementDropdown, props);
    fireEvent.click(screen.getByAltText('dropdownArrowIcon'));
    fireEvent.click(screen.getByText('Edit multisignature account'));
    expect(mockAddSearchParamsToUrl).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ modal: 'noTokenBalance' })
    );
  });

  it('Should render insufficient balance for fee error', () => {
    useTokenBalances.mockReturnValue({
      data: { data: mockAppsTokens.data.map((data) => ({ ...data, availableBalance: 10000 })) },
      isLoading: true,
    });
    useAppsMetaTokens.mockReturnValue({ data: mockAppsTokens, isLoading: false });
    useFees.mockReturnValue({
      data: { data: { feeTokenID: mockAppsTokens.data[0].tokenID } },
      isLoading: true,
    });

    const mockAddSearchParamsToUrl = jest
      .spyOn(searchParamUtils, 'addSearchParamsToUrl')
      .mockReturnValue({});

    const props = {
      currentAccount: mockHWAccounts[0],
      onMenuClick: mockOnMenuClick,
    };

    renderWithRouterAndQueryClient(AccountManagementDropdown, props);
    fireEvent.click(screen.getByAltText('dropdownArrowIcon'));
    fireEvent.click(screen.getByText('Edit multisignature account'));
    expect(mockAddSearchParamsToUrl).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ modal: 'noTokenBalance' })
    );
  });
});
