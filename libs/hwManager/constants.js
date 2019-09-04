
export const ADD_DEVICE = 'add';
export const REMOVE_DEVICE = 'remove';
export const MANUFACTURERS = {
  Ledger: {
    name: 'Ledger',
    models: {
      Ledeger_Nano_S: 'Ledeger Nano S',
      Ledeger_Nano_X: 'Ledeger Nano X',
    },
  },
  Trezor: {
    name: 'Trezor',
    models: {
      Trezor_Model_T: 'Trezor Model T',
      Trezor_Model_One: 'Trezor Model One',
    },
  },
};
export const IPC_MESSAGES = {
  CHECK_LEDGER: 'checkLedger',
  CONNECT: 'connect',
  DEVICE_LIST_CHANGED: 'hwDeviceListChanged',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  EXIT: 'exit',
  GET_CONNECTED_DEVICES_LIST: 'getConnectedDevicesList',
  HW_COMMAND: 'hwCommand',
  GET_PUBLICK_KEY: 'GET_PUBLICKEY',
  SIGN_TRANSACTION: 'SIGN_TX',
};
