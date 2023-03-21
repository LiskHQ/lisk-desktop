import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentHWDevice,
  selectHWAccounts,
} from '@hardwareWallet/store/selectors/hwSelectors';
import { setHWAccounts } from '@hardwareWallet/store/actions';
import { selectSettings } from 'src/redux/selectors';
import { getNameFromAccount } from '@hardwareWallet/utils/getNameFromAccount';
import { getHWAccounts } from '@hardwareWallet/utils/getHWAccounts';

const useHWAccounts = () => {
  const hwAccounts = useSelector(selectHWAccounts);
  const currentHWDevice = useSelector(selectCurrentHWDevice);
  const settings = useSelector(selectSettings);
  const [isLoadingHWAccounts, setIsLoadingHWAccounts] = useState(false);
  const [loadingHWAccountsError, setLoadingHWAccountsError] = useState();

  const getAccountName = (address, model) => getNameFromAccount(address, settings, model);

  const dispatch = useDispatch();
  const { ipc } = window;

  useEffect(() => {
    if (ipc && dispatch && currentHWDevice?.path) {
      (async () => {
        setIsLoadingHWAccounts(true);
        try {
          const accounts = await getHWAccounts(currentHWDevice, getAccountName);
          dispatch(setHWAccounts(accounts));
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
