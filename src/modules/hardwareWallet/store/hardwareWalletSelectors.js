export const selectHardwareDevices = (state) => state.hardwareWallet.hardwareDevices;
export const selectActiveHardwareDeviceId = (state) => state.hardwareWallet.activeHardwareDevice;
export const selectActiveHardwareDevice = (state) => {
  const hardwareDevices = selectHardwareDevices(state);
  const activeDeviceId = selectActiveHardwareDeviceId(state);

  return hardwareDevices.find((device) => device.deviceId === activeDeviceId);
};
