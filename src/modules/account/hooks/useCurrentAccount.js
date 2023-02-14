import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentAccount } from '@account/store/selectors';
import { stakesReset } from '@pos/validator/store/actions/staking';
import { setCurrentAccount } from '../store/action';

// eslint-disable-next-line
export function useCurrentAccount() {
  const dispatch = useDispatch();
  const setAccount = (encryptedAccount) => {
    dispatch(setCurrentAccount(encryptedAccount));
    // clear stakes list during login or accounts switch
    dispatch(stakesReset());
  };
  const currentAccount = useSelector(selectCurrentAccount);

  return [currentAccount, setAccount];
}
