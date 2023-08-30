import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  selectCurrentHWDevice,
  selectHWAccounts,
} from '@hardwareWallet/store/selectors/hwSelectors';
import { getNameFromAccount } from '@hardwareWallet/utils/getNameFromAccount';
import {
  getMultipleAddresses,
  resetLedgerIPCQueue,
} from '@libs/hardwareWallet/ledger/ledgerLiskAppIPCChannel/clientLedgerHWCommunication';

function useHWAccounts(nrOfAccounts) {
  const currentHWDevice = useSelector(selectCurrentHWDevice);
  const persistedHwAccounts = useSelector(selectHWAccounts);
  const [hwAccounts, setHwAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(undefined);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const accountIndexes = Array.from(Array(nrOfAccounts).keys());
        const addressesAndPubkeys = await getMultipleAddresses(
          currentHWDevice.path,
          accountIndexes
        );
        const accounts = Object.values(addressesAndPubkeys).map((addressAndPubkey, index) => {
          const { address, pubKey } = addressAndPubkey;
          const accountIndex = index + 1;
          const name =
            getNameFromAccount(address, persistedHwAccounts) || `Account ${accountIndex}`;

          return {
            hw: currentHWDevice,
            metadata: {
              address,
              pubkey: pubKey,
              accountIndex,
              name,
              isHW: true,
            },
          };
        });
        setHwAccounts(accounts);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [nrOfAccounts]);

  return { hwAccounts, isLoading };
}

export default useHWAccounts;
