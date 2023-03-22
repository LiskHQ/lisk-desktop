import {
  selectCurrentHWDevice,
  selectCurrentHWDevicePath,
  selectHardwareDevices,
  selectHWStatus,
  selectHWAccounts,
} from './hwSelectors';

describe('HardwareWallet selectors', () => {
  const mockState = {
    hardwareWallet: {
      devices: [
        { path: '1', status: 'connected' },
        { path: '2', status: 'connected' },
      ],
      currentDevice: { path: '1', status: 'connected' },
      accounts: [{ id: 1 }],
    },
  };
  const mockEmptyState = { hardwareWallet: {} };
  it('ActiveHardwareDevice Should return empty object ', async () => {
    expect(selectCurrentHWDevice(mockEmptyState)).toEqual({});
  });
  it('selectHWAccounts Should return empty array ', async () => {
    expect(selectHWAccounts(mockEmptyState)).toEqual([]);
  });
  it('selectHWAccounts Should return list of accounts', async () => {
    expect(selectHWAccounts(mockState)).toEqual(mockState.hardwareWallet.accounts);
  });
  it('Should select ActiveHardwareDevice', async () => {
    expect(selectCurrentHWDevice(mockState)).toEqual(mockState.hardwareWallet.currentDevice);
  });
  it('Should select ActiveHardware DeviceId', async () => {
    expect(selectCurrentHWDevicePath(mockState)).toEqual(
      mockState.hardwareWallet.currentDevice.path
    );
  });
  it('Should select HardwareDevices', async () => {
    expect(selectHardwareDevices(mockState)).toEqual(mockState.hardwareWallet.devices);
  });
  it('Should select active hardware wallet status', async () => {
    expect(selectHWStatus(mockState)).toEqual(mockState.hardwareWallet.currentDevice.status);
  });
});
