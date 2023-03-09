/* eslint-disable no-await-in-loop, max-statements */
import HWManager from '@hardwareWallet/manager/HWManager';
import { extractAddressFromPublicKey } from 'src/modules/wallet/utils/account';
import { getCheckInitializedAccount } from '@account/utils/getCheckInitializedAccount';

export const getHWAccounts = async ({
  getName,
  device // fetch device from HWManager
}) => {
  const accounts = [];
  let accountIndex = 0;
  // Get all initialized and uninitialized accounts
  while (true) {
    const pubkey = await HWManager.getPublicKey(accountIndex);
    const address = extractAddressFromPublicKey(pubkey);
    const config = { params: { address } };
    const isInitialized = await getCheckInitializedAccount({ config });
    if (!isInitialized) {
      accounts.push({
        hw: device,
        metadata: {
          address,
          pubkey,
          accountIndex,
          name: 'New account',
          path: '',
          isHW: true,
          isNew: true,
          creationTime: new Date().toISOString(),
        },
      });
      break;
    }
    accounts.push({
      hw: device,
      metadata: {
        address,
        pubkey,
        accountIndex,
        name: getName(address, device.model),
        path: '',
        isHW: true,
        creationTime: new Date().toISOString(),
      },
    });
    ++accountIndex;
  }
  return accounts;
};
