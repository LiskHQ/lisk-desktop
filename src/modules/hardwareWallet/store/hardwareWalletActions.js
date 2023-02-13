import { IPC_MESSAGES } from '@libs/hwServer/constants';

const { DEVICE_LIST_CHANGED, DEVICE_UPDATE } = IPC_MESSAGES;

export const setDeviceListChanged = (devices) => ({
  type: DEVICE_LIST_CHANGED,
  payload: devices,
});

export const setDeviceUpdated = (deviceId) => ({
  type: DEVICE_UPDATE,
  payload: deviceId,
});
