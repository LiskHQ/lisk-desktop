import { LEDGER_HW_HID_EVENT } from '@libs/hardwareWallet/ledger/constants';

const IPC = window.ipc;

export const subscribeToLedgerDeviceEvents = (fn) => {
  IPC[LEDGER_HW_HID_EVENT]((_, data) => fn(data));
};
