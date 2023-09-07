import { LedgerAccount } from '@zondax/ledger-lisk';
import TransportNodeHid from '@ledgerhq/hw-transport-node-hid';
import { getPubKey } from '@libs/hardwareWallet/ledger/ledgerLiskAppIPCChannel/serverLedgerHWCommunication/index';
import {LEDGER_CUSTOM_ERRORS} from "@libs/hardwareWallet/ledger/constants";

export const getLedgerAccount = (index = 0) => {
  const ledgerAccount = new LedgerAccount();
  ledgerAccount.account(index);
  return ledgerAccount;
};

export function getCustomErrorCode(error) {
  const errorMessage = error.message;
  const customError = Object.values(LEDGER_CUSTOM_ERRORS).find(({ match }) => errorMessage.includes(match));
  return customError?.return_code;
}

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
