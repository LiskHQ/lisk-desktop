export const RESPONSE = 'RESPONSE';
export const REQUEST = 'REQUEST';
export const LEDGER_HW_HID_EVENT = 'LEDGER_HW_HID_EVENT';
export const LEDGER_HW_IPC_CHANNELS = {
  GET_SIGNED_MESSAGE: 'GET_SIGNED_MESSAGE',
  GET_SIGNED_TRANSACTION: 'GET_SIGNED_TRANSACTION',
  GET_PUB_KEY: 'GET_PUB_KEY',
  GET_MULTIPLE_ADDRESSES: 'GET_MULTIPLE_ADDRESSES',
  RESET_LEDGER_IPC_QUEUE: 'RESET_LEDGER_IPC_QUEUE',
  GET_CONNECTED_DEVICES: 'GET_CONNECTED_DEVICES',
};
export const LEDGER_CUSTOM_ERRORS = {
  openDevicePath: {
    return_code: 1,
    match: 'cannot open device with path',
  },
};
export const CHECK_STATUS_INTERVAL = 4000;
