/* eslint-disable no-await-in-loop, max-statements */
import { extractAddressFromPublicKey } from 'src/modules/wallet/utils/account';
import { getCheckInitializedAccount } from '@account/utils/getCheckInitializedAccount';
import { getPubKey } from '@libs/hardwareWallet/ledger/ledgerLiskAppIPCChannel/clientLedgerHWCommunication';

export const getHWAccounts = async (currentHWDevice, getName) => {
  const accounts = [];
  let accountIndex = 0;
  // Get all initialized and uninitialized accounts
  while (true) {
    const pubkey = await getPubKey(currentHWDevice.path, accountIndex);
    const address = extractAddressFromPublicKey(pubkey);
    const isInitialized = await getCheckInitializedAccount(address, '0400000000000000');
    if (!isInitialized) {
      accounts.push({
        hw: currentHWDevice,
        metadata: {
          address,
          pubkey,
          accountIndex,
          name: 'New account',
          path: '',
          isHW: true,
          isNew: true,
        },
      });
      break;
    }
    accounts.push({
      hw: currentHWDevice,
      metadata: {
        address,
        pubkey,
        accountIndex,
        name: getName(address, 'Ledger'),
        path: '',
        isHW: true,
        creationTime: new Date().toISOString(),
      },
    });
    ++accountIndex;
  }
  return accounts;
};
