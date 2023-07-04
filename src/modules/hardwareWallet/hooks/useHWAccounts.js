import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentHWDevice,
  selectHWAccounts,
} from '@hardwareWallet/store/selectors/hwSelectors';
import { setHWAccounts } from '@hardwareWallet/store/actions';
import { getNameFromAccount } from '@hardwareWallet/utils/getNameFromAccount';
import { getHWAccounts } from '@hardwareWallet/utils/getHWAccounts';
import { resetLedgerIPCQueue } from '@libs/hardwareWallet/ledger/ledgerLiskAppIPCChannel/clientLedgerHWCommunication';

const useHWAccounts = () => {
  const hwAccounts = useSelector(selectHWAccounts);
  const currentHWDevice = useSelector(selectCurrentHWDevice);
  const [isLoadingHWAccounts, setIsLoadingHWAccounts] = useState(false);
  const [loadingHWAccountsError, setLoadingHWAccountsError] = useState();

  const getAccountName = (address) => getNameFromAccount(address, hwAccounts);

  const dispatch = useDispatch();
  const { ipc } = window;

  useEffect(() => {
    let isMounted = true;
    function getUniqueAccounts(accounts) {
      return accounts.reduce((accum, account) => {
        const indexOfAccount = accum.findIndex(
          (item) => item.metadata.address === account.metadata.address
        );
        if (indexOfAccount === -1) {
          accum.push(account);
        }
        return accum;
      }, []);
    }

    if (ipc && dispatch && currentHWDevice?.path && !isLoadingHWAccounts) {
      // eslint-disable-next-line max-statements
      (async () => {
        setIsLoadingHWAccounts(true);
        try {
          const accounts = await getHWAccounts(currentHWDevice, getAccountName);
          const uniqueAccounts = getUniqueAccounts(accounts);
          if (isMounted) {
            dispatch(setHWAccounts(uniqueAccounts));
            setLoadingHWAccountsError(undefined);
          }
        } catch (error) {
          if (isMounted) {
            setLoadingHWAccountsError(error);
          }
        } finally {
          if (isMounted) {
            setIsLoadingHWAccounts(false);
          }
        }
      })();
    }

    return () => {
      setIsLoadingHWAccounts(false);
      isMounted = false;
      if (ipc) {
        (async () => {
          await resetLedgerIPCQueue();
        })();
      }
    };
  }, [ipc, dispatch, currentHWDevice]);

  return { accounts: hwAccounts, isLoadingHWAccounts, loadingHWAccountsError };
};

export default useHWAccounts;
