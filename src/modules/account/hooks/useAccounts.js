import { useSelector, useDispatch } from 'react-redux';
import { selectAccounts } from '@account/store/selectors';
import { addAccount } from '../store/action';

// eslint-disable-next-line
export function useAccounts() {
  const dispatch = useDispatch();
  const setAccount = (accountSchema) => {
    dispatch(addAccount(accountSchema));
  };
  const currentAccount = useSelector(selectAccounts);

  return [currentAccount, setAccount];
}
