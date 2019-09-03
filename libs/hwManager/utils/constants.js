
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
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  EXIT: 'exit',
};
