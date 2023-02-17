import { IPC_MESSAGES } from '@libs/hwServer/constants';

const {DEVICE_LIST_CHANGED, DEVICE_UPDATE} = IPC_MESSAGES
const actionTypes = {
  setHWAccounts: 'HW_ACCOUNTS_ADD',
  removeHWAccounts: 'HW_ACCOUNTS_REMOVE',
  setDevices: `HW_${DEVICE_LIST_CHANGED}`,
  setCurrentDevice: `HW_${DEVICE_UPDATE}`,
};

export default actionTypes;
