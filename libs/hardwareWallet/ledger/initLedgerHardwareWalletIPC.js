import { ledgerDeviceListener } from '@libs/hardwareWallet/ledger/ledgerDeviceListener';
import { ledgerLiskAppIPCChannel } from '@libs/hardwareWallet/ledger/ledgerLiskAppIPCChannel';

export function initLedgerHardwareWalletIPC(win) {
  ledgerDeviceListener(win);
  ledgerLiskAppIPCChannel();
}
