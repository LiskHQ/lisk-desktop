import {
  selectActiveHardwareDevice,
  selectActiveHardwareDeviceId,
  selectHardwareDevices,
  selectHWStatus,
} from './hwSelectors';

describe('HardwareWallet selectors', () => {
  const mockState = {
    hardwareWallet: {
      devices: [
        { deviceId: '1', status: 'connected' },
        { deviceId: '2', status: 'connected' },
      ],
      currentDevice: { deviceId: '1', status: 'connected' },
    },
  };
  it('Should select ActiveHardwareDevice', async () => {
    expect(selectActiveHardwareDevice(mockState)).toEqual(mockState.hardwareWallet.currentDevice);
  });
  it('Should select ActiveHardware DeviceId', async () => {
    expect(selectActiveHardwareDeviceId(mockState)).toEqual(
      mockState.hardwareWallet.currentDevice.deviceId
    );
  });
  it('Should select HardwareDevices', async () => {
    expect(selectHardwareDevices(mockState)).toEqual(mockState.hardwareWallet.devices);
  });
  it('Should select active hardware wallet status', async () => {
    expect(selectHWStatus(mockState)).toEqual(mockState.hardwareWallet.currentDevice.status);
  });
});
