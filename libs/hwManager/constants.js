
export const ADD_DEVICE = 'add';
export const REMOVE_DEVICE = 'remove';
export const RESPONSE = 'result';
export const REQUEST = 'request';
export const PIN = 'pin';
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
  HW_CONNECTED: 'hwConnected',
  HW_DISCONNECTED: 'hwDisconnected',
  VALIDATE_TREZOR_PIN: 'validateTrezorPin',
  MISSING_PIN: 'pin_not_provided_from_ui',
};
export const FUNCTION_TYPES = {
  [IPC_MESSAGES.GET_PUBLICK_KEY]: 'getPublicKey',
  [IPC_MESSAGES.SIGN_TRANSACTION]: 'signTransaction',
};
