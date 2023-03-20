export const selectHardwareDevices = (state) => state.hardwareWallet.devices || [];
export const selectCurrentHWDevice = (state) => state.hardwareWallet.currentDevice || {};
export const selectCurrentHWDevicePath = (state) => selectCurrentHWDevice(state).path;
export const selectHWStatus = (state) => selectCurrentHWDevice(state).status;
export const selectHWAccounts = (state) => state.hardwareWallet?.accounts || [];
