import { ledgerDeviceListener } from '@libs/ledgerHardwareWallet/ledgerDeviceListener';
import { ledgerLiskAppIPCChannel } from '@libs/ledgerHardwareWallet/ledgerLiskAppIPCChannel';

export function initLedgerHardwareWalletIPC(win) {
  ledgerDeviceListener(win);
  ledgerLiskAppIPCChannel();
}
