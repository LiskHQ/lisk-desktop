import { screen } from '@testing-library/react';
import { renderWithRouterAndStore } from 'src/utils/testHelpers';
import HardwareAccountManagerModal from './HardwareAccountManagerModal';

const mockStore = {
  hardwareWallet: {
    devices: [
      {
        path: '13123123',
        model: 'Ledger Nano S',
      },
      {
        path: '44523123',
        model: 'Ledger Nano X',
      },
    ],
    currentDevice: {
      path: '44523123',
    },
  },
};

describe('HardwareAccountManagerModal', () => {
  it('Should show Switch account in the title', () => {
    renderWithRouterAndStore(HardwareAccountManagerModal, null, mockStore);
    expect(screen.getByText('Import account from hardware wallet')).toBeTruthy();
  });
});
