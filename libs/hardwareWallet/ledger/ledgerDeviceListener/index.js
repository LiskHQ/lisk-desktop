import TransportNodeHid from '@ledgerhq/hw-transport-node-hid';
import { LEDGER_HW_HID_EVENT } from '@libs/hardwareWallet/ledger/constants';
import { getPubKey } from '@libs/hardwareWallet/ledger/ledgerLiskAppIPCChannel/serverLedgerHWCommunication';

export const ledgerDeviceListener = (win) => {
  TransportNodeHid.listen({
    next: async ({ type, device: fullDevice }) => {
      let isAppOpen = false;
      if (fullDevice.path) {
        try {
          isAppOpen = !!await getPubKey({ devicePath: fullDevice.path, accountIndex: 1 });
        } catch (e) {
          isAppOpen = false;
        }
      }

      const data = {
        type,
        device: {
          path: fullDevice.path,
          manufacturer: fullDevice.manufacturer,
          product: fullDevice.product,
          isAppOpen,
        },
      };

      win.send({ event: LEDGER_HW_HID_EVENT, value: data });
    },
  });
};
