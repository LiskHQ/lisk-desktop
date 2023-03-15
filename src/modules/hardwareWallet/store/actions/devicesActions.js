import actionTypes from '@hardwareWallet/store/actions/actionTypes';

export const setHardwareWalletDevices = (devices) => ({
  type: actionTypes.setHWDevices,
  payload: devices,
});

export const setCurrentHWDevice = (device) => ({
  type: actionTypes.setCurrentHWDevice,
  payload: device,
});

export const addHWDevice = (device) => ({
  type: actionTypes.addHWDevice,
  payload: device,
});

export const removeHWDevice = (device) => ({
  type: actionTypes.removeHWDevice,
  payload: device,
});
