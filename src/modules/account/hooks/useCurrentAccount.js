import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentAccount } from '@account/store/selectors';
import { selectStaking } from 'src/redux/selectors';
import { stakesReset } from '@pos/validator/store/actions/staking';
import {
  removeThenAppendSearchParamsToUrl,
  removeSearchParamsFromUrl,
} from 'src/utils/searchParams';
import routes from 'src/routes/routes';
import { setCurrentAccount } from '../store/action';

// eslint-disable-next-line
export function useCurrentAccount(history) {
  const dispatch = useDispatch();
  const stakingQueue = useSelector(selectStaking);
  const pendingStakes = Object.values(stakingQueue).filter(
    (stake) => stake.confirmed !== stake.unconfirmed
  );

  const setAccount = (encryptedAccount, referrer) => {
    // clear stakes list during login or accounts switch
    if (pendingStakes.length) {
      const state = {
        header: 'Pending Stakes',
        content:
          'Switching your account will remove all your pending stakes. Are you sure you want to continue?',
        cancelText: 'Cancel switch',
        onCancel: /* istanbul ignore next */ () => removeSearchParamsFromUrl(history, ['modal']),
        confirmText: 'Continue to switch',
        onConfirm: /* istanbul ignore next */ () => {
          dispatch(setCurrentAccount(encryptedAccount));

          dispatch(stakesReset());
          history.push(referrer || routes.wallet.path);
        },
      };
      removeThenAppendSearchParamsToUrl(history, { modal: 'confirmationDialog' }, ['modal'], state);
    } else {
      dispatch(setCurrentAccount(encryptedAccount));
    }
  };
  const currentAccount = useSelector(selectCurrentAccount);

  return [currentAccount, setAccount];
}
