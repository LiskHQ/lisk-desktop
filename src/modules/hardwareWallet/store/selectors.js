export const selectHardwareDevices = (state) => state.hardwareWallet.devices;
export const selectActiveHardwareDeviceId = (state) => state.hardwareWallet.currentDevice.deviceId;
export const selectActiveHardwareDevice = (state) => state.hardwareWallet.currentDevice;
