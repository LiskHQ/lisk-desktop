import { useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAccounts } from '@account/store/selectors';
import { addAccount, removeAccount } from '../store/action';

// eslint-disable-next-line
export function useAccounts() {
  const dispatch = useDispatch();
  const accountsObject = useSelector(selectAccounts);
  const setAccount = useCallback((account) => dispatch(addAccount(account)), []);
  const deleteAccountWithAddress = useCallback(
    (address) => dispatch(removeAccount(address)),
    [],
  );
  const getAccountWithAddress = (address) => accountsObject[address];
  const accounts = useMemo(
    () => Object.values(accountsObject),
    [accountsObject],
  );

  return {
    accounts,
    setAccount,
    deleteAccountWithAddress,
    getAccountWithAddress,
  };
}
