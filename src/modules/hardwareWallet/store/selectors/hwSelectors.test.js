import {
  selectActiveHardwareDevice,
  selectActiveHardwareDeviceId,
  selectHardwareDevices,
} from './hwSelectors';

describe('HardwareWallet selectors', () => {
  const mockState = {
    hardwareWallet: {
      devices: [{ deviceId: '1' }, { deviceId: '2' }],
      currentDevice: { deviceId: '1' },
    },
  };
  it('Should select ActiveHardwareDevice', async () => {
    expect(selectActiveHardwareDevice(mockState)).toEqual(mockState.hardwareWallet.currentDevice);
  });
  it('Should select ActiveHardwareDeviceId', async () => {
    expect(selectActiveHardwareDeviceId(mockState)).toEqual(mockState.hardwareWallet.currentDevice.deviceId);
  });
  it('Should select HardwareDevices', async () => {
    expect(selectHardwareDevices(mockState)).toEqual(mockState.hardwareWallet.devices);
  });
});
