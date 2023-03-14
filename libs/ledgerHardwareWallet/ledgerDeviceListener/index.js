import TransportNodeHid from '@ledgerhq/hw-transport-node-hid';
import { LEDGER_HW_HID_EVENT } from '@libs/ledgerHardwareWallet/constants';

export const ledgerDeviceListener = (win) => {
  TransportNodeHid.listen({
    next: ({ type, device: fullDevice }) => {
      const data = {
        type,
        device: {
          path: fullDevice.path,
          manufacturer: fullDevice.manufacturer,
          product: fullDevice.product,
        },
      };
      win.send({ event: LEDGER_HW_HID_EVENT, value: data });
    },
  });
};
