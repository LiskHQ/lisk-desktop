import { useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAccounts } from '@account/store/selectors';
import { selectHWAccounts } from '@hardwareWallet/store/selectors/hwSelectors';
import { addAccount, deleteAccount } from '../store/action';

// eslint-disable-next-line
export function useAccounts() {
  const dispatch = useDispatch();
  const accountsObject = useSelector(selectAccounts);
  const hwAccounts = useSelector(selectHWAccounts);
  const setAccount = useCallback((account) => dispatch(addAccount(account)), []);
  const deleteAccountByAddress = useCallback((address) => dispatch(deleteAccount(address)), []);

  const accounts = useMemo(
    () => [...Object.values(accountsObject), ...hwAccounts],
    [accountsObject, hwAccounts]
  );
  const getAccountByAddress = (address) =>
    accounts.find((account) => account.metadata.address === address);

  return {
    accounts,
    setAccount,
    deleteAccountByAddress,
    getAccountByAddress,
  };
}
