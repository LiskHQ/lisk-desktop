import { LedgerAccount } from '@zondax/ledger-lisk';
import TransportNodeHid from '@ledgerhq/hw-transport-node-hid';
import { getPubKey } from '@libs/hardwareWallet/ledger/ledgerLiskAppIPCChannel/serverLedgerHWCommunication/index';

export const getLedgerAccount = (index = 0) => {
  const ledgerAccount = new LedgerAccount();
  ledgerAccount.account(index);
  return ledgerAccount;
};

// eslint-disable-next-line max-statements
export async function getDevicesFromPaths(devicePaths) {
  const devices = [];
  let transport = TransportNodeHid;
  try {
    let isAppOpen = false;
    if (devicePaths[0]) {
      try {
        isAppOpen = !!(await getPubKey({ devicePath: devicePaths[0], accountIndex: 1 }));
      } catch (e) {
        isAppOpen = false;
      }
    }

    // eslint-disable-next-line no-restricted-syntax,no-unused-vars
    for (const devicePath of devicePaths) {
      // eslint-disable-next-line no-await-in-loop
      transport = await transport.open(devicePath);
      const deviceInfo = transport.device?.getDeviceInfo();
      // eslint-disable-next-line no-await-in-loop
      await transport.close();
      devices.push({
        path: devicePath,
        manufacturer: deviceInfo.manufacturer,
        product: deviceInfo.product,
        isAppOpen,
      });
    }
  } catch (error) {
    if (transport && transport.close) await transport.close();
    return Promise.reject(error);
  }

  return devices;
}
