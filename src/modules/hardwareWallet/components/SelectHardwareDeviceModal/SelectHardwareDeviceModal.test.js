import { screen } from '@testing-library/react';
import { renderWithRouterAndStore } from 'src/utils/testHelpers';
import SelectHardwareDeviceModal from './SelectHardwareDeviceModal';

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

describe('SelectHardwareDeviceModal', () => {
  it('Should show Switch account in the title', () => {
    renderWithRouterAndStore(SelectHardwareDeviceModal, null, mockStore);
    expect(screen.getByText('Select hardware wallet device')).toBeTruthy();
    expect(
      screen.getByText(
        'Choose a hardware wallet to perform your transactions on add to your Lisk Desktop'
      )
    ).toBeTruthy();
    expect(screen.getByText('Back to wallet')).toBeTruthy();
  });
});
