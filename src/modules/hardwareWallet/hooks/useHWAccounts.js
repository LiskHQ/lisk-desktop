import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentHWDevice,
  selectHWAccounts,
} from '@hardwareWallet/store/selectors/hwSelectors';
import { setHWAccounts } from '@hardwareWallet/store/actions';
import { getNameFromAccount } from '@hardwareWallet/utils/getNameFromAccount';
import { getHWAccounts } from '@hardwareWallet/utils/getHWAccounts';

const useHWAccounts = () => {
  const hwAccounts = useSelector(selectHWAccounts);
  const currentHWDevice = useSelector(selectCurrentHWDevice);
  const [isLoadingHWAccounts, setIsLoadingHWAccounts] = useState(false);
  const [loadingHWAccountsError, setLoadingHWAccountsError] = useState();

  const getAccountName = (address) => getNameFromAccount(address, hwAccounts);

  const dispatch = useDispatch();
  const { ipc } = window;

  useEffect(() => {
    if (ipc && dispatch && currentHWDevice?.path) {
      (async () => {
        setIsLoadingHWAccounts(true);
        try {
          const accounts = await getHWAccounts(currentHWDevice, getAccountName);
          const uniqueAccounts = accounts.reduce((accum, account) => {
            const indexOfAccount = accum.findIndex(
              // eslint-disable-next-line max-nested-callbacks
              (item) => item.metadata.address === account.metadata.address
            );
            if (indexOfAccount === -1) {
              accum.push(account);
            }
            return accum;
          }, []);
          dispatch(setHWAccounts(uniqueAccounts));
          setLoadingHWAccountsError(undefined);
        } catch (error) {
          setLoadingHWAccountsError(error);
        } finally {
          setIsLoadingHWAccounts(false);
        }
      })();
    }
  }, [ipc, dispatch, currentHWDevice]);

  return { accounts: hwAccounts, isLoadingHWAccounts, loadingHWAccountsError };
};

export default useHWAccounts;
