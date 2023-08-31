import { fireEvent, screen } from '@testing-library/react';
import { renderWithRouterAndStore } from 'src/utils/testHelpers';
import { mockHWAccounts } from '@hardwareWallet/__fixtures__';
import useHWAccounts from '@hardwareWallet/hooks/useHWAccounts';
import HardwareAccountManagerModal from './HardwareAccountManagerModal';

jest.mock('src/modules/hardwareWallet/hooks/useHWAccounts');

useHWAccounts.mockReturnValue({
  hwAccounts: undefined,
  isLoading: false,
  loadingHWAccountsError: undefined,
});

const mockState = {
  hardwareWallet: {
    currentDevice: {
      manufacturer: '',
      path: '',
      product: '',
      status: 'standby',
      isAppOpen: false,
    },
  },
};

const mockStateAppOpen = {
  hardwareWallet: {
    currentDevice: {
      ...mockState.hardwareWallet.currentDevice,
      isAppOpen: true,
      status: 'connected',
    },
  },
};

describe('HardwareAccountManagerModal', () => {
  it('Should show Switch account in the title', () => {
    renderWithRouterAndStore(HardwareAccountManagerModal, null, mockState);
    expect(screen.getByText('Import account from hardware wallet')).toBeTruthy();
    expect(
      screen.getByText(
        'Please open the Lisk app on your hardware wallet device to see your accounts.'
      )
    ).toBeTruthy();
  });

  it('Should shows loading state', () => {
    useHWAccounts.mockReturnValue({
      hwAccounts: undefined,
      isLoading: true,
      loadingHWAccountsError: undefined,
    });
    renderWithRouterAndStore(HardwareAccountManagerModal, null, mockStateAppOpen);
    expect(screen.getByText('Loading hardware wallet accounts…')).toBeTruthy();
  });

  it('Should show load more if app is open', () => {
    useHWAccounts.mockReturnValue({
      hwAccounts: mockHWAccounts,
      isLoading: false,
      loadingHWAccountsError: undefined,
    });
    renderWithRouterAndStore(HardwareAccountManagerModal, null, mockStateAppOpen);
    expect(screen.getByText('Load more')).toBeTruthy();
  });

  it('Should load 3 more accounts when Load more is clicked', () => {
    useHWAccounts.mockReturnValue({
      hwAccounts: mockHWAccounts,
      isLoading: false,
      loadingHWAccountsError: undefined,
    });
    renderWithRouterAndStore(HardwareAccountManagerModal, null, mockStateAppOpen);
    fireEvent.click(screen.getByRole('button', { name: 'Load more' }));
    expect(useHWAccounts).toBeCalledWith(6);
  });
});
