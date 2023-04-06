/* eslint-disable no-await-in-loop, max-statements */
import { extractAddressFromPublicKey } from 'src/modules/wallet/utils/account';
import { getTokenBalances } from 'src/modules/account/utils/getTokenBalances';
import { getPubKey } from '@libs/hardwareWallet/ledger/ledgerLiskAppIPCChannel/clientLedgerHWCommunication';

export const getHWAccounts = async (currentHWDevice, getName) => {
  const accounts = [];
  let accountIndex = 0;
  // Get all initialized and uninitialized accounts
  while (true) {
    const pubkey = await getPubKey(currentHWDevice.path, accountIndex);
    const address = extractAddressFromPublicKey(pubkey);
    const tokenBalances = await getTokenBalances(address);
    const isInitialized =
      tokenBalances.length > 0 && BigInt(tokenBalances[0].availableBalance || 0) > BigInt(0);
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
