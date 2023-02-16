import { IPC_MESSAGES } from '@libs/hwServer/constants';

const {DEVICE_LIST_CHANGED, DEVICE_UPDATE} = IPC_MESSAGES
const actionTypes = {
  storeHWAccounts: 'HW_ACCOUNTS_ADD',
  removeHWAccounts: 'HW_ACCOUNTS_REMOVE',
  changeDevices: `HW_${DEVICE_LIST_CHANGED}`,
  deviceUpdate: `HW_${DEVICE_UPDATE}`,
};

export default actionTypes;
