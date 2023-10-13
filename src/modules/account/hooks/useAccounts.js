import { useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAccounts, selectAccountNonce } from '@account/store/selectors';
import { selectHWAccounts } from '@hardwareWallet/store/selectors/hwSelectors';
import { addAccount, deleteAccount, setAccountNonce } from '../store/action';

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

  const getAccountByPublicKey = (pubkey) =>
    accounts.find((account) => account.metadata.pubkey === pubkey);

  const setNonceByAccount = useCallback(
    (address, nonce) => dispatch(setAccountNonce(address, nonce)),
    []
  );

  const getNonceByAccount = (address) => useSelector(selectAccountNonce)[address];

  return {
    accounts,
    setAccount,
    deleteAccountByAddress,
    getAccountByPublicKey,
    getAccountByAddress,
    setNonceByAccount,
    getNonceByAccount,
  };
}
