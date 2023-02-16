import { IPC_MESSAGES } from '@libs/hwServer/constants';

const { DEVICE_LIST_CHANGED, DEVICE_UPDATE } = IPC_MESSAGES;

export const setHardwareWalletDevices = (devices) => ({
  type: `HW_${DEVICE_LIST_CHANGED}`,
  devices,
});

export const setCurrentDevice = ({device}) => ({
  type: `HW_${DEVICE_UPDATE}`,
  device,
});
