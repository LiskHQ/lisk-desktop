import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentAccount } from '@account/store/selectors';
import { setCurrentAccount } from '../store/action';

// eslint-disable-next-line
export function useCurrentAccount() {
  const dispatch = useDispatch();
  const setAccount = (accountSchema) => {
    dispatch(setCurrentAccount(accountSchema));
  };
  const currentAccount = useSelector(selectCurrentAccount);

  return [currentAccount, setAccount];
}
