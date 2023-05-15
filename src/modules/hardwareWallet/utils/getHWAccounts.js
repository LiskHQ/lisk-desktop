/* eslint-disable no-await-in-loop, max-statements */
import { extractAddressFromPublicKey } from '@wallet/utils/account';
import { getTokenBalances } from '@account/utils/getTokenBalances';
import { getPubKey } from '@libs/hardwareWallet/ledger/ledgerLiskAppIPCChannel/clientLedgerHWCommunication';

export const getHWAccounts = async (currentHWDevice, getAccountName) => {
  const accounts = [];
  let accountIndex = 0;
  // Get all initialized and uninitialized accounts
  while (true) {
    const pubkey = await getPubKey(currentHWDevice.path, accountIndex);
    const address = extractAddressFromPublicKey(pubkey);
    const tokenBalances = await getTokenBalances(address);
    const isInitialized =
      tokenBalances.length > 0 && BigInt(tokenBalances[0].availableBalance || 0) > BigInt(0);
    const account = {
      hw: currentHWDevice,
      metadata: {
        address,
        pubkey,
        accountIndex,
        path: '',
        isHW: true,
      },
    };

    if (!isInitialized) {
      const name = getAccountName(address) || `Account ${accountIndex + 1}`;
      accounts.push({
        ...account,
        metadata: {
          ...account.metadata,
          name,
          isNew: true,
        },
      });
      break;
    }

    accounts.push({
      ...account,
      metadata: {
        ...account.metadata,
        name: getAccountName(address) || `Account ${accountIndex + 1}`,
        creationTime: new Date().toISOString(),
      },
    });

    ++accountIndex;
  }
  return accounts;
};
