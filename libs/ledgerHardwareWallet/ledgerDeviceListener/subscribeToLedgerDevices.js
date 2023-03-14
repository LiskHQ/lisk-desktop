import { LEDGER_HW_HID_EVENT } from '@libs/ledgerHardwareWallet/constants';

const IPC = window.ipc;

export const subscribeToLedgerDeviceEvents = (fn) => {
  IPC.on(LEDGER_HW_HID_EVENT, (action, data) => fn(data));
};
