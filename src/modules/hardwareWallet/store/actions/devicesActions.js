import actionTypes from '@hardwareWallet/store/actions/actionTypes';

export const setHardwareWalletDevices = (devices) => ({
  type: actionTypes.setDevices,
  devices,
});

export const setCurrentDevice = ({ device }) => ({
  type: actionTypes.setCurrentDevice,
  device,
});
