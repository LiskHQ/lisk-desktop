import {
  selectActiveHardwareDevice,
  selectActiveHardwareDeviceId,
  selectHardwareDevices,
} from './hardwareWalletSelectors';

describe('HardwareWallet selectors', () => {
  const mockState = {
    hardwareWallet: {
      hardwareDevices: [{ deviceId: '1' }, { deviceId: '2' }],
      activeHardwareDeviceId: '',
    },
  };
  it('Should select ActiveHardwareDevice', async () => {
    expect(selectActiveHardwareDevice(mockState)).toBeFalsy();
  });
  it('Should select ActiveHardwareDeviceId', async () => {
    expect(selectActiveHardwareDeviceId(mockState)).toEqual('');
  });
  it('Should select HardwareDevices', async () => {
    expect(selectHardwareDevices(mockState)).toEqual(mockState.hardwareWallet.hardwareDevices);
  });
});
