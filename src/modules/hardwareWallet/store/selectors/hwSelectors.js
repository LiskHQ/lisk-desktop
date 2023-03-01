export const selectHardwareDevices = (state) => state.hardwareWallet.devices;
export const selectActiveHardwareDevice = (state) => state.hardwareWallet.currentDevice || {};
export const selectActiveHardwareDeviceId = (state) => selectActiveHardwareDevice(state).deviceId;
export const selectHWStatus = (state) => selectActiveHardwareDevice(state).status;
export const selectHWAccounts = (state) => state.hardwareWallet?.accounts || [];
